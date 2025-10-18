#!/bin/bash

# 用户列表查询接口测试脚本
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY3LCJ1c2VybmFtZSI6InNhZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc2MDc2MzQ4NSwiZXhwIjoxNzYxMzY4Mjg1fQ.HFGmtsWdtBUcwYXLV05CjhsYr8sJbokfDxOX99TqwGQ"

echo "========================================="
echo "用户列表查询接口测试"
echo "========================================="

# 测试1：基础分页查询
echo ""
echo "=== 测试1: 基础分页查询（第1页，每页2条）==="
curl -s "http://localhost:3000/api/admin/users?page=1&pageSize=2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    pagination = data['data']['pagination']
    print(f\"✅ 成功 - 共{pagination['total']}条记录，当前第{pagination['page']}页，每页{pagination['limit']}条\")
    for user in users:
        print(f\"  - ID:{user['id']}, 用户名:{user['username']}, 昵称:{user.get('nickname', 'N/A')}, 角色:{user['role']}\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

# 测试2：用户名模糊查询
echo ""
echo "=== 测试2: 用户名模糊查询（username=test）==="
curl -s "http://localhost:3000/api/admin/users?username=test&pageSize=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    print(f\"✅ 找到 {len(users)} 个用户\")
    for user in users:
        print(f\"  - 用户名:{user['username']}, 昵称:{user.get('nickname', 'N/A')}\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

# 测试3：昵称模糊查询
echo ""
echo "=== 测试3: 昵称模糊查询（nickname=管理）==="
curl -s "http://localhost:3000/api/admin/users?nickname=管理&pageSize=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    print(f\"✅ 找到 {len(users)} 个用户\")
    for user in users:
        print(f\"  - 用户名:{user['username']}, 昵称:{user.get('nickname', 'N/A')}\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

# 测试4：角色筛选 - 普通用户
echo ""
echo "=== 测试4: 角色筛选（role=user）==="
curl -s "http://localhost:3000/api/admin/users?role=user&pageSize=3" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    pagination = data['data']['pagination']
    print(f\"✅ 找到 {pagination['total']} 个普通用户，显示前{len(users)}个\")
    for user in users:
        print(f\"  - 用户名:{user['username']}, 角色:{user['role']}\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

# 测试5：角色筛选 - 管理员
echo ""
echo "=== 测试5: 角色筛选（role=admin）==="
curl -s "http://localhost:3000/api/admin/users?role=admin&pageSize=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    pagination = data['data']['pagination']
    print(f\"✅ 找到 {pagination['total']} 个管理员\")
    for user in users:
        print(f\"  - 用户名:{user['username']}, 角色:{user['role']}\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

# 测试6：角色筛选 - 超级管理员
echo ""
echo "=== 测试6: 角色筛选（role=super_admin）==="
curl -s "http://localhost:3000/api/admin/users?role=super_admin&pageSize=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    pagination = data['data']['pagination']
    print(f\"✅ 找到 {pagination['total']} 个超级管理员\")
    for user in users:
        print(f\"  - 用户名:{user['username']}, 角色:{user['role']}\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

# 测试7：状态筛选 - 启用
echo ""
echo "=== 测试7: 状态筛选（is_active=true）==="
curl -s "http://localhost:3000/api/admin/users?is_active=true&pageSize=3" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    pagination = data['data']['pagination']
    print(f\"✅ 找到 {pagination['total']} 个启用用户，显示前{len(users)}个\")
    for user in users:
        status = '启用' if user['is_active'] else '禁用'
        print(f\"  - 用户名:{user['username']}, 状态:{status}\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

# 测试8：状态筛选 - 禁用
echo ""
echo "=== 测试8: 状态筛选（is_active=false）==="
curl -s "http://localhost:3000/api/admin/users?is_active=false&pageSize=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    pagination = data['data']['pagination']
    print(f\"✅ 找到 {pagination['total']} 个禁用用户\")
    for user in users:
        status = '启用' if user['is_active'] else '禁用'
        print(f\"  - 用户名:{user['username']}, 状态:{status}\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

# 测试9：创建时间范围查询
echo ""
echo "=== 测试9: 创建时间范围查询（2025-10-01 至 2025-10-10）==="
curl -s "http://localhost:3000/api/admin/users?createdStartDate=2025-10-01&createdEndDate=2025-10-10&pageSize=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    pagination = data['data']['pagination']
    print(f\"✅ 找到 {pagination['total']} 个用户\")
    for user in users:
        created = user['created_at'][:10] if user.get('created_at') else 'N/A'
        print(f\"  - 用户名:{user['username']}, 创建时间:{created}\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

# 测试10：最后登录时间范围查询
echo ""
echo "=== 测试10: 最后登录时间范围查询（2025-10-15之后）==="
curl -s "http://localhost:3000/api/admin/users?loginStartDate=2025-10-15&pageSize=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    pagination = data['data']['pagination']
    print(f\"✅ 找到 {pagination['total']} 个用户\")
    for user in users:
        last_login = user.get('last_login_at', 'N/A')
        if last_login != 'N/A':
            last_login = last_login[:10]
        print(f\"  - 用户名:{user['username']}, 最后登录:{last_login}\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

# 测试11：全局搜索（search参数）
echo ""
echo "=== 测试11: 全局搜索（search=admin，匹配用户名/昵称/邮箱）==="
curl -s "http://localhost:3000/api/admin/users?search=admin&pageSize=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    pagination = data['data']['pagination']
    print(f\"✅ 找到 {pagination['total']} 个用户\")
    for user in users:
        print(f\"  - 用户名:{user['username']}, 昵称:{user.get('nickname', 'N/A')}, 邮箱:{user.get('email', 'N/A')}\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

# 测试12：组合查询 - 角色+状态
echo ""
echo "=== 测试12: 组合查询（role=user AND is_active=true）==="
curl -s "http://localhost:3000/api/admin/users?role=user&is_active=true&pageSize=3" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    pagination = data['data']['pagination']
    print(f\"✅ 找到 {pagination['total']} 个启用的普通用户，显示前{len(users)}个\")
    for user in users:
        status = '启用' if user['is_active'] else '禁用'
        print(f\"  - 用户名:{user['username']}, 角色:{user['role']}, 状态:{status}\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

# 测试13：组合查询 - 用户名+创建时间
echo ""
echo "=== 测试13: 组合查询（username=test AND createdStartDate=2025-10-01）==="
curl -s "http://localhost:3000/api/admin/users?username=test&createdStartDate=2025-10-01&pageSize=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    pagination = data['data']['pagination']
    print(f\"✅ 找到 {pagination['total']} 个用户\")
    for user in users:
        created = user['created_at'][:10] if user.get('created_at') else 'N/A'
        print(f\"  - 用户名:{user['username']}, 创建时间:{created}\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

# 测试14：空结果查询
echo ""
echo "=== 测试14: 空结果查询（username=不存在的用户名xyz123）==="
curl -s "http://localhost:3000/api/admin/users?username=不存在的用户名xyz123" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    pagination = data['data']['pagination']
    print(f\"✅ 找到 {pagination['total']} 个用户（预期为0）\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

# 测试15：大分页参数
echo ""
echo "=== 测试15: 大分页参数（page=1, pageSize=100）==="
curl -s "http://localhost:3000/api/admin/users?page=1&pageSize=100" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    users = data['data']['users']
    pagination = data['data']['pagination']
    print(f\"✅ 成功 - 共{pagination['total']}条记录，返回{len(users)}条\")
else:
    print(f\"❌ 失败: {data['message']}\")
"

echo ""
echo "========================================="
echo "测试完成！"
echo "========================================="
