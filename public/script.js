var appState = {
    username: '',
    token: '',
    loggedIn: false,
}

var App = Vue.extend({});

var router = new VueRouter();

router.map({
    '/': {
        component: RequestToken
    },
    '/enter': {
        component: EnterToken
    },
    '/dashboard': {
        component: Dashboard,
        auth: true
    }
})

router.beforeEach(function (transition) {
    if (transition.to.auth) {
        if (!appState.loggedIn) {
            transition.abort();
        }
        transition.next();
    } else {
        if (appState.loggedIn) {
            transition.abort();
        }
        transition.next();
    }
})

router.start(App, '#app')
