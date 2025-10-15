#!/bin/bash

# ====================================================
# 一键设置脚本 - RBAC 系统 + 超级管理员
# ====================================================
# 用途: 自动执行所有必要的数据库迁移脚本
# 使用方法: bash migrations/setup_all.sh
# ====================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 数据库配置
DB_NAME="health_management"
DB_USER="root"

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}   健康管理系统 - RBAC 权限系统安装脚本${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo ""

# 检查 MySQL 是否可用
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ 错误: 未找到 MySQL 命令${NC}"
    echo -e "${YELLOW}请确保 MySQL 已安装并添加到 PATH${NC}"
    exit 1
fi

# 提示输入密码
echo -e "${YELLOW}请输入 MySQL root 密码:${NC}"
read -s DB_PASSWORD
echo ""

# 测试数据库连接
echo -e "${BLUE}📡 测试数据库连接...${NC}"
if ! mysql -u"$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME;" 2>/dev/null; then
    echo -e "${RED}❌ 数据库连接失败${NC}"
    echo -e "${YELLOW}请检查:${NC}"
    echo -e "  1. MySQL 服务是否运行"
    echo -e "  2. 数据库名称是否正确: $DB_NAME"
    echo -e "  3. 用户名和密码是否正确"
    exit 1
fi
echo -e "${GREEN}✅ 数据库连接成功${NC}"
echo ""

# 步骤 1: 修复 users 表结构
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}步骤 1/3: 修复 users 表结构${NC}"
echo -e "${BLUE}=====================================================${NC}"
if mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < migrations/fix_users_table.sql; then
    echo -e "${GREEN}✅ users 表结构修复完成${NC}"
else
    echo -e "${RED}❌ users 表结构修复失败${NC}"
    exit 1
fi
echo ""

# 步骤 2: 执行 RBAC 系统迁移
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}步骤 2/3: 执行 RBAC 权限系统迁移${NC}"
echo -e "${BLUE}=====================================================${NC}"
if mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < migrations/rbac_system.sql; then
    echo -e "${GREEN}✅ RBAC 系统迁移完成${NC}"
else
    echo -e "${RED}❌ RBAC 系统迁移失败${NC}"
    exit 1
fi
echo ""

# 步骤 3: 创建超级管理员（如果 rbac_system.sql 已包含，此步骤可选）
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}步骤 3/3: 验证超级管理员账户${NC}"
echo -e "${BLUE}=====================================================${NC}"
# 检查超级管理员是否存在
ADMIN_EXISTS=$(mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -se "SELECT COUNT(*) FROM users WHERE username='sadmin';")
if [ "$ADMIN_EXISTS" -eq "1" ]; then
    echo -e "${GREEN}✅ 超级管理员账户已存在${NC}"
else
    echo -e "${YELLOW}⚠️  超级管理员账户不存在，正在创建...${NC}"
    if mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < migrations/insert_super_admin.sql; then
        echo -e "${GREEN}✅ 超级管理员账户创建成功${NC}"
    else
        echo -e "${RED}❌ 超级管理员账户创建失败${NC}"
        exit 1
    fi
fi
echo ""

# 显示最终状态
echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}   🎉 所有步骤执行完成！${NC}"
echo -e "${GREEN}=====================================================${NC}"
echo ""
echo -e "${BLUE}📊 系统状态:${NC}"

# 查询角色统计
echo -e "${YELLOW}角色统计:${NC}"
mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "
SELECT
  r.name AS '角色名称',
  r.code AS '角色代码',
  COUNT(u.id) AS '用户数量'
FROM roles r
LEFT JOIN users u ON r.id = u.role_id
GROUP BY r.id, r.name, r.code;
"

# 查询超级管理员信息
echo ""
echo -e "${YELLOW}超级管理员账户:${NC}"
mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "
SELECT
  id AS 'ID',
  username AS '用户名',
  email AS '邮箱',
  role AS '角色',
  created_at AS '创建时间'
FROM users
WHERE username = 'sadmin';
"

echo ""
echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}登录信息:${NC}"
echo -e "${GREEN}=====================================================${NC}"
echo -e "${YELLOW}用户名:${NC} sadmin"
echo -e "${YELLOW}密码:${NC}   sadmin666"
echo -e "${YELLOW}角色:${NC}   超级管理员"
echo -e "${GREEN}=====================================================${NC}"
echo ""
echo -e "${BLUE}💡 提示: 首次登录后请立即修改密码！${NC}"
echo ""
