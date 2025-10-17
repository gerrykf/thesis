#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY3LCJ1c2VybmFtZSI6InNhZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc2MDY3MzMwMSwiZXhwIjoxNzYxMjc4MTAxfQ.ZpWFqnDfXOsxIrRPkxuM7pSY5CThttGPFdwQsIevPrY"

echo "=== 测试1: 创建菜单 ==="
curl -s -X POST http://localhost:3000/api/admin/menus \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" \
  -d '{"parent_id":0,"menu_type":0,"title":"测试菜单","name":"TestMenu","path":"/test","component":"test/index","rank":99,"icon":"ep:star-filled","keep_alive":1,"show_link":1,"status":1}' \
  | python3 -m json.tool

echo -e "\n\n=== 测试2: 获取菜单列表 ==="
curl -s -X GET http://localhost:3000/api/admin/menus \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" \
  | python3 -m json.tool | head -30

echo -e "\n\n=== 测试3: 更新菜单 ==="
# 更新刚创建的测试菜单（假设ID为54）
curl -s -X PUT http://localhost:3000/api/admin/menus/54 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" \
  -d '{"title":"测试菜单(已修改)","rank":98}' \
  | python3 -m json.tool

echo -e "\n\n=== 测试4: 删除菜单 ==="
curl -s -X DELETE http://localhost:3000/api/admin/menus/54 \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Client-Type: admin" \
  | python3 -m json.tool
