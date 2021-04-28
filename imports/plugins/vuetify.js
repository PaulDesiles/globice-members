import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

// Vue.use(Vuetify, {
//   theme: {
//     primary: '#FAFAFA',
//     secondary: '#414141',
//     accent: '#212121',
//     error: '#f44336',
//     warning: '#ffeb3b',
//     info: '#2196f3',
//     success: '#4caf50',
//   },
// });


Vue.use(Vuetify);

const opts = {
  theme: {
    themes: {
      light: {
        primary: '#2BA7D9',
        secondary: '#1F2E53',
        accent: '#2BA7D9',
        background: '#eee'
      },
      dark: {
        primary: '#2BA7D9',
        secondary: '#1F2E53',
        accent: '#2BA7D9',
        background: '#eee'
      },
    },
  }
};

export default new Vuetify(opts);