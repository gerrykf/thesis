#!/bin/bash
# 排查 404 问题的调试脚本

echo "======================================"
echo "  排查图片 404 问题"
echo "======================================"
echo ""

# 要检查的文件
FILE_NAME="13_1762017388825.png"
UPLOADS_DIR="/opt/1panel/www/sites/healthbackend/index/server_upload/uploads"
AVATARS_DIR="${UPLOADS_DIR}/avatars"
FILE_PATH="${AVATARS_DIR}/${FILE_NAME}"

echo "【1】检查文件是否存在"
echo "文件路径: $FILE_PATH"
if [ -f "$FILE_PATH" ]; then
    echo "✓ 文件存在"
    ls -lh "$FILE_PATH"
else
    echo "✗ 文件不存在"
    echo ""
    echo "查找该文件名在其他位置："
    find /opt/1panel/www/sites/healthbackend -name "$FILE_NAME" 2>/dev/null
fi
echo ""

echo "【2】检查目录权限"
echo "上传目录:"
ls -ld "$UPLOADS_DIR"
echo ""
echo "头像目录:"
ls -ld "$AVATARS_DIR"
echo ""
if [ -f "$FILE_PATH" ]; then
    echo "目标文件:"
    ls -lh "$FILE_PATH"
fi
echo ""

echo "【3】检查目录内容"
echo "avatars 目录下的所有文件："
ls -lh "$AVATARS_DIR/" 2>/dev/null || echo "目录不存在或为空"
echo ""

echo "【4】检查 Nginx 配置"
NGINX_CONF="/www/sites/frontend/vhost.conf"
if [ -f "$NGINX_CONF" ]; then
    echo "Nginx 配置文件: $NGINX_CONF"
    echo ""
    echo "location /uploads/ 配置："
    grep -A 10 "location /uploads/" "$NGINX_CONF"
else
    echo "未找到 Nginx 配置文件"
    echo "尝试查找其他位置："
    find /www/sites -name "*.conf" -type f 2>/dev/null | grep -i frontend
fi
echo ""

echo "【5】测试 Nginx alias 路径解析"
NGINX_ALIAS=$(grep -A 1 "location /uploads/" "$NGINX_CONF" 2>/dev/null | grep "alias" | awk '{print $2}' | tr -d ';')
if [ -n "$NGINX_ALIAS" ]; then
    echo "Nginx alias: $NGINX_ALIAS"
    echo "请求 URL: /uploads/avatars/${FILE_NAME}"
    echo "实际查找: ${NGINX_ALIAS}avatars/${FILE_NAME}"
    echo ""
    EXPECTED_FILE="${NGINX_ALIAS}avatars/${FILE_NAME}"
    if [ -f "$EXPECTED_FILE" ]; then
        echo "✓ Nginx 应该能找到文件"
    else
        echo "✗ Nginx 找不到文件"
        echo "期望路径: $EXPECTED_FILE"
    fi
fi
echo ""

echo "【6】测试本地访问"
echo "测试命令: curl -I http://localhost/uploads/avatars/${FILE_NAME}"
curl -I "http://localhost/uploads/avatars/${FILE_NAME}" 2>&1 | head -20
echo ""

echo "【7】测试外部访问"
echo "测试命令: curl -I https://healthmanage.xin/uploads/avatars/${FILE_NAME}"
curl -I "https://healthmanage.xin/uploads/avatars/${FILE_NAME}" 2>&1 | head -20
echo ""

echo "【8】检查 Nginx 错误日志（最近10条）"
ERROR_LOG="/www/sites/frontend/log/error.log"
if [ -f "$ERROR_LOG" ]; then
    echo "错误日志: $ERROR_LOG"
    tail -10 "$ERROR_LOG"
else
    echo "未找到错误日志文件"
fi
echo ""

echo "【9】检查 Nginx 访问日志（最近5条 uploads 相关）"
ACCESS_LOG="/www/sites/frontend/log/access.log"
if [ -f "$ACCESS_LOG" ]; then
    echo "访问日志: $ACCESS_LOG"
    grep "uploads" "$ACCESS_LOG" | tail -5
else
    echo "未找到访问日志文件"
fi
echo ""

echo "======================================"
echo "  建议修复步骤"
echo "======================================"
echo ""

if [ ! -f "$FILE_PATH" ]; then
    echo "1. 文件不存在，请先上传头像："
    echo "   - 访问 https://healthmanage.xin"
    echo "   - 登录并上传头像"
    echo ""
fi

echo "2. 如果文件存在但无法访问，检查权限："
echo "   chmod 644 $FILE_PATH"
echo "   chmod 755 $AVATARS_DIR"
echo "   chmod 755 $UPLOADS_DIR"
echo ""

echo "3. 检查 Nginx 配置是否正确："
echo "   nginx -t"
echo "   nginx -s reload"
echo ""

echo "4. 检查 Nginx alias 路径是否正确："
echo "   期望: alias ${UPLOADS_DIR}/;"
echo "   实际: $(grep -A 1 'location /uploads/' $NGINX_CONF 2>/dev/null | grep alias)"
echo ""
