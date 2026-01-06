import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const codes =
    MOCK_CODES.find((item) => item.username === userinfo.username)?.codes ?? [];
    let roles = {
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
  return useResponseSuccess(roles);
});
