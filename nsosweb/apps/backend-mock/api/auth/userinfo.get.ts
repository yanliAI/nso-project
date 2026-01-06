export default defineEventHandler((event) => {
  const userinfo = {
    "id": "0",
    "usercode": "admin",
    "username": "系统管理员",
    "logincode": "admin",
    "orgcode": "02",
    "orgname": "中国南方电网有限责任公司",
    "orgShortname": "中国南方电网",
    "logintime": "2025-01-14 14:52:30",
    "roles": [
        {
            "rolecode": "1",
            "rolename": "管理员"
        },
        {
            "rolecode": "2",
            "rolename": "班长"
        },
        {
            "rolecode": "3",
            "rolename": "值长"
        }
    ],
    "rolecodes": [
        "1",
        "2",
        "3"
    ],
    "rolenames": [
        "管理员",
        "班长",
        "值长"
    ]
}
  return useResponseSuccess(userinfo);
});
