import cookie from 'react-cookies';

import { TOKEN_NAME_REFRESH, TOKEN_NAME_ACCESS } from "../Constants";

export const checkTokenExist = () => {
	if (cookie.load(TOKEN_NAME_ACCESS)) {
		return true;
	} return false;
};

export const  writeTokens = async ({RefreshToken=null, AccessToken=null}) => {
	if (RefreshToken !== null && RefreshToken !== undefined) {
		cookie.save(TOKEN_NAME_REFRESH, RefreshToken, {path: '/'});
	}
	if (AccessToken !== null && AccessToken !== undefined) {
		cookie.save(TOKEN_NAME_ACCESS, AccessToken, {path: '/'});
	}
}

export const discardTokens = () => {
	cookie.remove(TOKEN_NAME_ACCESS);
	cookie.remove(TOKEN_NAME_REFRESH);
}