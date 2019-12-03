const BASE_URLS = {
  development: {
    XXX_API: 'xxxApiDevBaseUrl'
  },
  test: {
    XXX_API: 'xxxApiTestBaseUrl'
  },
  production: {
    XXX_API: 'xxxApiProdBaseUrl'
  }
};

export const XXX_API_BASE_URL = BASE_URLS[process.env.NODE_ENV].XXX_API;

export const LOGIN_URL = `${XXX_API_BASE_URL}/login`;
