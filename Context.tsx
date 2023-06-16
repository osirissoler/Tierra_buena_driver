import React from 'react';
import { checkStorage } from './components/Shared';
import { sendData } from './httpRequests';

const initialState = {
	onlineStatus: false
};

const contextWrapper = (component?: React.Component) => ({
	...initialState,
	changeStatus: (status: boolean) => {
		checkStorage('USER_LOGGED', (data: any) => {
			const url = '/user/getDriverById';
			sendData(url, JSON.parse(data)).then((response: any) => {
				if (Object.keys(response).length > 0) {
					const driver = response['driver'];
					const url = '/user/updateDriverActive';
					const data = {
						id: driver.id,
						active: status
					};
					sendData(url, data).then((response: any) => {
						if (Object.keys(response).length > 0) {
							initialState.onlineStatus = status;
							component?.setState({ context: contextWrapper(component) });
						}
					});
				}
			});
		});
	}
});

type Context = ReturnType<typeof contextWrapper>;

export const Context = React.createContext<Context>(contextWrapper());

interface State {
	context: Context;
}

export class ContextProvider extends React.Component {
	state: State = {
		context: contextWrapper(this)
	};

	render() {
		return <Context.Provider value={this.state.context}>{this.props.children}</Context.Provider>;
	}
}
