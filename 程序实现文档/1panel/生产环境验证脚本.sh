#!/bin/bash
# 1panel 生产环境验证脚本
# 用于验证头像上传功能的所有配置是否正确

echo "======================================"
echo "  1panel 生产环境验证脚本"
echo "======================================"
echo ""

# 配置变量（根据实际情况修改）
PROJECT_PATH="/opt/1panel/www/sites/healthbackend/index/server_upload"
UPLOADS_DIR="${PROJECT_PATH}/uploads"
AVATARS_DIR="${UPLOADS_DIR}/avatars"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_pass() {
    echo -e "${GREEN}✓ $1${NC}"
}

check_fail() {
    echo -e "${RED}✗ $1${NC}"
}

check_warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

echo "【1】检查项目目录是否存在"
if [ -d "$PROJECT_PATH" ]; then
    check_pass "项目目录存在: $PROJECT_PATH"
else
    check_fail "项目目录不存在: $PROJECT_PATH"
    exit 1
fi
echo ""

echo "【2】检查上传目录是否存在"
if [ -d "$UPLOADS_DIR" ]; then
    check_pass "上传目录存在: $UPLOADS_DIR"
else
    check_fail "上传目录不存在: $UPLOADS_DIR"
    echo "尝试创建目录..."
    mkdir -p "$AVATARS_DIR"
    if [ -d "$AVATARS_DIR" ]; then
        check_pass "已创建: $AVATARS_DIR"
    else
        check_fail "创建失败"
        exit 1
    fi
fi

if [ -d "$AVATARS_DIR" ]; then
    check_pass "头像目录存在: $AVATARS_DIR"
else
    check_fail "头像目录不存在: $AVATARS_DIR"
    mkdir -p "$AVATARS_DIR"
fi
echo ""

echo "【3】检查目录权限"
UPLOADS_PERM=$(stat -c "%a" "$UPLOADS_DIR" 2>/dev/null || stat -f "%A" "$UPLOADS_DIR" 2>/dev/null)
UPLOADS_OWNER=$(stat -c "%U:%G" "$UPLOADS_DIR" 2>/dev/null || stat -f "%Su:%Sg" "$UPLOADS_DIR" 2>/dev/null)

echo "上传目录权限: $UPLOADS_PERM"
echo "上传目录所有者: $UPLOADS_OWNER"

if [ "$UPLOADS_PERM" -ge "755" ]; then
    check_pass "权限正确 (>= 755)"
else
    check_warn "权限可能不足，建议设置为755"
    echo "执行: chmod -R 755 $UPLOADS_DIR"
fi
echo ""

echo "【4】检查已上传的文件"
FILE_COUNT=$(find "$AVATARS_DIR" -type f -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.webp" 2>/dev/null | wc -l)
echo "已上传头像数量: $FILE_COUNT"

if [ $FILE_COUNT -gt 0 ]; then
    check_pass "发现 $FILE_COUNT 个头像文件"
    echo "最近的5个文件:"
    find "$AVATARS_DIR" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.webp" \) -printf "%T@ %p\n" 2>/dev/null | sort -rn | head -5 | awk '{print "  - " $2}'
else
    check_warn "没有找到头像文件"
fi
echo ""

echo "【5】检查 .env 配置文件"
ENV_FILE="${PROJECT_PATH}/.env.development2"
if [ -f "$ENV_FILE" ]; then
    check_pass "配置文件存在: $ENV_FILE"

    UPLOAD_PATH_CONFIG=$(grep "^UPLOAD_PATH=" "$ENV_FILE" | cut -d'=' -f2)
    echo "UPLOAD_PATH 配置: $UPLOAD_PATH_CONFIG"

    if [ "$UPLOAD_PATH_CONFIG" == "$UPLOADS_DIR" ]; then
        check_pass "UPLOAD_PATH 配置正确"
    else
        check_fail "UPLOAD_PATH 配置不匹配"
        echo "期望: $UPLOADS_DIR"
        echo "实际: $UPLOAD_PATH_CONFIG"
    fi
else
    check_warn "配置文件不存在: $ENV_FILE"
fi
echo ""

echo "【6】检查 Nginx 配置"
NGINX_CONF_PATTERN="/etc/nginx/sites-enabled/*healthmanage*"
NGINX_CONF=$(ls $NGINX_CONF_PATTERN 2>/dev/null | head -1)

if [ -z "$NGINX_CONF" ]; then
    # 尝试其他可能的路径
    NGINX_CONF_PATTERN="/www/sites/frontend/nginx/*.conf"
    NGINX_CONF=$(ls $NGINX_CONF_PATTERN 2>/dev/null | head -1)
fi

if [ -n "$NGINX_CONF" ]; then
    check_pass "Nginx配置文件: $NGINX_CONF"

    if grep -q "location /uploads/" "$NGINX_CONF"; then
        check_pass "找到 /uploads/ location 配置"

        ALIAS_PATH=$(grep -A 1 "location /uploads/" "$NGINX_CONF" | grep "alias" | awk '{print $2}' | tr -d ';')
        echo "Nginx alias 路径: $ALIAS_PATH"

        if [ "${ALIAS_PATH%/}" == "${UPLOADS_DIR}" ]; then
            check_pass "Nginx alias 路径正确"
        else
            check_warn "Nginx alias 路径可能不匹配"
            echo "期望: ${UPLOADS_DIR}/"
            echo "实际: $ALIAS_PATH"
        fi
    else
        check_warn "未找到 /uploads/ location 配置"
    fi
else
    check_warn "未找到 Nginx 配置文件"
fi
echo ""

echo "【7】测试 Nginx 配置语法"
if command -v nginx &> /dev/null; then
    if nginx -t 2>&1 | grep -q "successful"; then
        check_pass "Nginx 配置语法正确"
    else
        check_fail "Nginx 配置语法错误"
        nginx -t
    fi
else
    check_warn "未安装 nginx 或不在 PATH 中"
fi
echo ""

echo "【8】测试文件访问（如果有文件）"
if [ $FILE_COUNT -gt 0 ]; then
    TEST_FILE=$(find "$AVATARS_DIR" -type f \( -name "*.png" -o -name "*.jpg" \) | head -1)
    if [ -n "$TEST_FILE" ]; then
        TEST_FILENAME=$(basename "$TEST_FILE")
        echo "测试文件: $TEST_FILENAME"

        # 测试本地文件读取
        if [ -r "$TEST_FILE" ]; then
            check_pass "文件可读"
        else
            check_fail "文件不可读"
        fi

        # 测试URL访问
        echo ""
        echo "请在浏览器访问以下URL测试:"
        echo "  https://healthmanage.xin/uploads/avatars/$TEST_FILENAME"
        echo ""
        echo "或执行以下命令测试:"
        echo "  curl -I https://healthmanage.xin/uploads/avatars/$TEST_FILENAME"
    fi
fi
echo ""

echo "======================================"
echo "  验证完成"
echo "======================================"
echo ""
echo "如果发现问题，请执行以下修复命令:"
echo ""
echo "# 1. 创建目录"
echo "mkdir -p $AVATARS_DIR"
echo ""
echo "# 2. 设置权限"
echo "chmod -R 755 $UPLOADS_DIR"
echo "chown -R node:node $UPLOADS_DIR  # 或使用你的 Node.js 运行用户"
echo ""
echo "# 3. 修改 .env.development2"
echo "echo 'UPLOAD_PATH=$UPLOADS_DIR' >> $ENV_FILE"
echo ""
echo "# 4. 重载 Nginx"
echo "nginx -s reload"
echo ""
echo "# 5. 重启 Node.js 应用（在1panel管理面板操作）"
echo ""
