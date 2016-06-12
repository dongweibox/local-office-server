var Dashboard = Vue.extend({
    data: function () {
        currentView: 'home'
        return {
            appState: appState,
            working: false,
            userData: {
                mac_addresses: []
            }
        };
    },
    template: `
        <div>
            <p>Dashboard &ndash; {{ appState.username }}</p>
            <p>Your MAC addresses for identification:</p>
            Add new: <input :disabled="working" v-model="newMacAddress" v-on:keyup.enter="addMacAddress">
            <ul>
                <li v-for="mac in userData.mac_addresses">
                    <span>{{ mac.mac_address }}</span>
                    <button :disabled="mac.deleting" v-on:click="removeAddress($index, mac)">❌</button>
                </li>
            </ul>
        </div>`,
    methods: {
        lockForm: function () {
            this.working = true;
        },
        freeForm: function () {
            this.working = false;
        },
        addMacAddress: function () {
            var text = this.newMacAddress.trim();
            if (text) {
                this.lockForm();
                this.$http.post('/api/users/me/mac-addresses',
                    {address: text}
                ).then(
                    function(result) {
                        this.newMacAddress = '';
                        this.freeForm();
                        this.loadAddresses();
                    }, function(error) {
                        this.freeForm();
                    }
                );
            }
        },
        removeAddress: function (index, mac) {
            mac.deleting = true;
            this.userData.mac_addresses.$set(index, mac);
            this.$http.delete('/api/mac-addresses/' + mac.id).then(
                function(result) {
                    this.loadAddresses();
                }
            );
        },
        loadAddresses: function () {
            this.$http.get('/api/users/me/mac-addresses').then(
                function(result) {
                    for (var i=0; i<result.data.length; i++) {
                        Vue.set(result.data[i], 'deleting', false);
                    }
                    this.userData.mac_addresses = result.data;
                }
            );
        }
    },
    ready: function () {
        this.loadAddresses();
    }
})
