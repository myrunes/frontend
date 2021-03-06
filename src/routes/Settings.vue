<!-- @format -->

<template>
  <div class="viewlimit-width">
    <Banner ref="banner" class="mb-3"></Banner>
    <InfoBubble ref="mailInfo" color="orange">
      <p>
        Mail Address changed. Please confirm your Mail Address by following the
        link in the confirmation mail we have sent to you.
      </p>
      <p>Please also check your spam folder for the mail.</p>
    </InfoBubble>

    <!-- ACCOUNT DETAILS -->
    <div class="bg mb-3">
      <h3>ACCOUNT DETAILS</h3>
      <table>
        <tbody>
          <tr>
            <td class="pr-5">Created</td>
            <td>{{ formatTime(user.created) }}</td>
          </tr>
          <tr>
            <td class="pr-5">Last Login</td>
            <td>{{ formatTime(user.lastlogin) }}</td>
          </tr>
          <tr>
            <td class="pr-5">Pages</td>
            <td>{{ pages }}</td>
          </tr>
          <tr>
            <td class="pr-5">UID</td>
            <td class="hider">{{ user.uid }}</td>
          </tr>
        </tbody>
      </table>

      <div class="mt-3">
        <h3>LOGIN SESSIONS</h3>
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Last Access</th>
              <th>Deadline</th>
              <th>User Agent</th>
              <th>IP Address</th>
            </tr>
            <tr v-for="t in refreshtokens" :key="t.uid">
              <td>{{ t.id }}</td>
              <td>{{ formatTime(t.lastaccess) }}</td>
              <td>{{ formatTime(t.deadline) }}</td>
              <td :title="t.lastaccessclient">{{ capString(t.lastaccessclient, 20) }}</td>
              <td class="hider">{{ t.lastaccessip }}</td>
              <td class="pl-3">
                <div title="Revoke Session" class="btn-del" @click="revokeSession(t.id)"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- API ACESS -->
    <div class="bg mb-3">
      <h3>API ACCESS</h3>
      <h5>API Token</h5>
      <p class="explainer mb-3">
        The API token is a base64 encoded string which can used to be passed
        with API requests to authenticate as your account.
        <br />
        <b>Keep this key secure! It gives full access on your account!</b>
      </p>
      <div v-if="apitoken" class>
        <p class="hider w-fit-content">{{ apitoken }}</p>
        <i class="created">Created: {{ formatTime(apitokencreated) }}</i>
      </div>
      <div v-else>
        <i class="text-embed">No API token generated.</i>
      </div>
      <button class="btn-slide mt-3 mr-3" @click="generateAPIToken">
        GENERATE TOKEN
      </button>
      <button class="btn-slide mt-3 mr-3" @click="deleteAPIToken">
        DELETE TOKEN
      </button>
      <button
        v-if="apitoken"
        class="btn-slide mt-3"
        @click="copyTokenToClipboard"
      >
        COPY TO CLIPBOARD
      </button>
    </div>

    <!-- DATA STORAGE -->
    <div class="bg mb-3">
      <h3>DATA STORAGE</h3>
      <h5>Local storage</h5>
      <p class="explainer">
        We store some client-side data directly in the browser using
        <a
          class="link"
          href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API"
          target="_blank"
          >local storage</a
        >.
        <br />
        <a
          class="link"
          href="https://github.com/myrunes/backend/blob/master/docs/cookie-usage.md"
          target="_blank"
          >Here</a
        >
        you can read about what particular data is saved in the local storage by
        MYRUNES.
      </p>
      <button class="btn-slide btn-delete mt-2" @click="deleteLocalStorage">
        DELETE LOCAL STORAGE
      </button>
    </div>

    <!-- UPDATE ACCOUNT -->
    <div class="bg" id="update-acc-container">
      <h3 class="mb-3">UPDATE ACCOUNT</h3>

      <div
        class="bg highlight-zone mb-4"
        :class="{ highlight: highlightCurrPass }"
      >
        <p>
          You need to enter your current password again to apply these changes:
        </p>
        <div class="position-relative">
          <input v-model="currpassword" type="password" class="tb text-left" />
          <span class="tb" />
        </div>
      </div>

      <div class="position-relative mb-4">
        <h5>Username</h5>
        <p class="explainer">
          The unique identifier you need to use to log in.
          <br />The username must be lowercase, longer than 3 characters and
          must only contain letters, numbers, scores and underscores.
        </p>
        <input
          v-model="user.username"
          type="text"
          class="tb text-left"
          @input="unameInput"
        />
        <span class="tb" />
      </div>

      <div class="position-relative mb-4">
        <h5>Display Name</h5>
        <p class="explainer">The name which may be displayed to other users.</p>
        <input v-model="user.displayname" type="text" class="tb text-left" />
        <span class="tb" />
      </div>

      <div class="position-relative mb-4">
        <h5>Mail Address</h5>
        <p class="explainer">
          Your E-Mail Address, which can be contacted if you forgot your account
          password.
        </p>
        <input v-model="user.mailaddress" type="text" class="tb text-left" />
        <span class="tb" />
      </div>

      <div class="position-relative">
        <h5>New Password</h5>
        <p class="explainer">Enter a new password, if you want to change it.</p>
        <input
          ref="tbNewpw"
          v-model="newpassword"
          type="password"
          class="tb text-left"
        />
        <span class="tb" />
        <a
          class="ml-2"
          @mousedown="$refs.tbNewpw.type = 'text'"
          @mouseup="$refs.tbNewpw.type = 'password'"
        >
          <img src="/assets/eye.svg" width="20" height="20" />
        </a>
      </div>

      <div class="mt-4">
        <div class="bg danger-zone mb-3">
          <h5 class="mb-3">DANGER ZONE</h5>
          <button class="btn-slide btn-delete" @click="deleteAcc">
            DELETE ACCOUNT PERMANENTLY AND FOREVER
          </button>
        </div>
        <div class="text-right">
          <button class="btn-slide btn-save mr-3" @click="save">SAVE</button>
          <button class="btn-slide btn-cancel" @click="$router.back()">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/** @format */

import Rest from '../js/rest';
import Utils from '../js/utils';
import EventBus from '../js/eventbus';
import Banner from '../components/Banner';
import InfoBubble from '../components/InfoBubble';

export default {
  name: 'Settings',

  components: {
    Banner,
    InfoBubble,
  },

  data: function() {
    return {
      user: {},
      refreshtokens: [],
      currsessionid: '',
      pages: 0,
      newpassword: '',
      currpassword: '',
      originMailAddress: '',

      highlightCurrPass: false,

      apitoken: null,
      apitokencreated: null,
    };
  },

  created: function() {
    Rest.getMe()
      .then((res) => {
        if (!res.body) return;
        this.user = res.body;
        this.originMailAddress = this.user.mailaddress;
      })
      .catch(console.error);

    Rest.getPages()
      .then((res) => {
        if (!res.body) return;
        this.pages = res.body.n;
      })
      .catch(console.error);

    Rest.getAPIToken()
      .then((res) => {
        if (!res.body) return;
        this.apitoken = res.body.token;
        this.apitokencreated = new Date(res.body.created);
      })
      .catch((err) => {
        if (err && err.code === 404) return;
        console.error(err);
      });

    Rest.getRefreshTokens().then(res => {
      if (!res.body) return;
      this.refreshtokens = res.body.data;
    }).catch(console.error)
  },

  methods: {
    formatTime(timestamp) {
      let t = Utils.parseTime(new Date(timestamp));
      return `${t.y}/${t.m}/${t.d} ${t.h}:${t.m}:${t.s}`;
    },

    unameInput(e) {
      this.user.username = this.user.username
        .toLowerCase()
        .replace(/[^\w_\-]/g, '');
    },

    save() {
      const currpw = this.currpassword;

      if (!currpw) {
        this.highlightCurrPassword();
        return;
      }

      this.currpassword = '';

      if (this.newpassword && this.newpassword.length < 8) {
        this.$refs.banner.show(
          'error',
          'Password must have at least 8 characters!',
          10000,
          true
        );
        window.scrollTo(0, 0);
        return;
      }

      let update = {
        username: this.user.username,
        displayname: this.user.displayname,
        currpassword: currpw,
        newpassword: this.newpassword,
      };

      if (this.user.mailaddress !== this.originMailAddress) {
        if (!this.user.mailaddress) {
          Rest.setMailAddress('', true, currpw)
            .then(() => {})
            .catch(console.error);
        } else {
          Rest.setMailAddress(this.user.mailaddress, false, currpw)
            .then(() => {
              this.$refs.mailInfo.show();
            })
            .catch(console.error);
        }
      }

      Rest.updateUser(update)
        .then(() => {
          this.$refs.banner.show(
            'success',
            'Account changes saved.',
            10000,
            true
          );
          window.scrollTo(0, 0);
        })
        .catch((err) => {
          this.$refs.banner.show(
            'error',
            err.message === 'unauthorized'
              ? 'Current password is wrong.'
              : `Saving failed: ${err.message ? err.message : err}`,
            10000,
            true
          );
          window.scrollTo(0, 0);
          console.error(err);
        });
    },

    deleteAcc() {
      let currpw = this.currpassword;

      if (!currpw) {
        this.highlightCurrPassword();
        return;
      }

      this.currpassword = '';

      const confMsg = `Do you really want to delete the account "${this.user.username}" permanently? THIS ACTION CAN NOT BE UNDONE!`;
      if (!confirm(confMsg)) {
        return;
      }

      Rest.deleteUser(currpw)
        .then(() => {
          EventBus.$emit('logout');
          this.$router.push('/login');
        })
        .catch((err) => {
          this.$refs.banner.show(
            'error',
            err.message === 'unauthorized'
              ? 'Current password is wrong.'
              : `Saving failed: ${err.message ? err.message : err}`,
            10000,
            true
          );
          window.scrollTo(0, 0);
          console.error(err);
        });
    },

    deleteLocalStorage() {
      window.localStorage.clear();
      this.$refs.banner.show(
        'success',
        'Local storage was cleared.',
        10000,
        true
      );
      window.scrollTo(0, 0);
    },

    generateAPIToken() {
      Rest.generateAPIToken()
        .then((res) => {
          if (!res.body) return;
          this.apitoken = res.body.token;
          this.apitokencreated = new Date(res.body.created);
        })
        .catch(console.error);
    },

    deleteAPIToken() {
      Rest.deleteAPIToken()
        .then((res) => {
          this.apitoken = this.apitokencreated = null;
        })
        .catch(console.error);
    },

    copyTokenToClipboard() {
      Utils.copyToClipboard(this.apitoken)
        .then(() =>
          this.$refs.banner.show(
            'success',
            'Copied token to clipboard.',
            6000,
            true
          )
        )
        .catch((err) =>
          this.$refs.banner.show(
            'error',
            'Copying to clipboard failed: ' + err,
            10000,
            true
          )
        );
    },

    highlightCurrPassword() {
      const container = this.$el
        .querySelector('#update-acc-container')
        .scrollIntoView();
      setTimeout(() => (this.highlightCurrPass = true), 250);
      setTimeout(() => (this.highlightCurrPass = false), 250 + 1000);
    },

    capString(s, l) { return Utils.capString(s, l) },

    revokeSession(sid) {
      Rest.deleteRefreshToken(sid).then(() => {
        const i = this.refreshtokens.findIndex(t => t.id === sid);
        if (i >= 0) {
          this.refreshtokens.splice(i, 1);
        }
      }).catch(console.error);
    }
  },
};
</script>

<style scoped>
/** @format */

@keyframes hightlight-box-bg {
  0% {
    background-color: #34525f;
  }
  50% {
    background-color: #477081;
  }
  100% {
    background-color: #34525f;
  }
}

.hider {
  color: rgb(33, 33, 33) !important;
  background-color: rgb(33, 33, 33);
  min-width: 145px;
}

.hider:hover {
  color: white !important;
  background-color: transparent;
}

.hider:hover::before {
  display: none;
}

.hider::before {
  content: 'HOVER TO DISPLAY';
  color: rgb(133, 133, 133);
  font-size: 14px;
  position: absolute;
  transform: translate(4px, 1px);
}

.highlight {
  background-color: #ffd92f75;
}

.created {
  font-size: 14px;
  margin-top: 5px;
  color: rgb(192, 192, 192) !important;
}

h5,
p {
  margin: 0px;
}

h5 {
  font-family: 'Montserrat', sans-serif;
}

td,
th {
  padding-right: 20px;
}

.explainer {
  font-style: italic;
  font-size: 14px;
}

.danger-zone {
  background-color: rgba(198, 40, 40, 0.3);
  width: fit-content;
  height: fit-content;
}

.highlight-zone {
  background-color: #34525f;
  width: fit-content;
}

.highlight-zone.highlight {
  animation: hightlight-box-bg 1s ease;
}

.btn-delete {
  background-color: rgb(244, 67, 54);
}

.btn-delete::before {
  background-color: rgb(213, 0, 0);
}

.btn-del {
  height: 1em;
  width: 1em;
  background-image: url('/assets/trash.svg');
  background-size: 100%;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.20s ease;
}

.btn-del:hover {
  opacity: 1;
}
</style>
