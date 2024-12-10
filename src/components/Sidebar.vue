<template>
  <div class="columns is-narrow-mobile">
    <div class="column is-12 is-sidebar-menu">
      <aside class="menu mySidebar flat-card">
        <div class="header">
          <article class="media">
            <div class="media-content">
              <div class="content">
                <div class="image is-48x48" style="display: block; margin: 0 auto">
                  <img class="is-rounded profile-pict" src="../assets/user.png" />
                </div>
                <p class="has-text-centered dynamic-title" style="margin-top: 10px ;margin-bottom: 10px !important">
                  <strong>{{ name }}</strong>
                </p>
              </div>
            </div>
          </article>
          <hr>
          <div class="columns is-multiline dynamic-subtitle">
            <div v-for="(item, index) in menuList" :key="index" class="column is-6 has-text-centered custom-padding">
              <router-link tag="div" :to="item.path"
                :class="['menu-btn', { 'active-menu has-text-white': ($route.path).startsWith(item.path) }]">
                <b-icon :icon="item.icon" size="is-medium"></b-icon>
                <p>
                  <small>{{ item.name }}</small>
                </p>
              </router-link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import swal from "sweetalert";
import { getToken, getDataUser } from "../localstorage-helper";
import { capitalizeLetter } from "../function-helper";

export default {
  data() {
    return {
      active: "",
      // activePage: "",
      menuList: [
        {
          name: 'Products',
          icon: "bottle-wine",
          path: "/product"
        },
        {
          name: 'Brand / Type',
          icon: "tag",
          path: "/brand"
        },
        {
          name: 'Category',
          icon: "format-list-bulleted",
          path: "/category"
        },
        {
          name: 'Country',
          icon: "earth",
          path: "/country"
        },
        {
          name: 'News',
          icon: "newspaper",
          path: "/news"
        },
        {
          name: 'Subscriber',
          icon: "account-group",
          path: "/subscriber"
        },

        // {
        //   name: 'Kelola Material',
        //   icon: "door",
        //   path: "/material"
        // },
      ]
    };
  },
  computed: {
    ...mapState({
      role: state => state.login.dataUser.role,
      name: state => state.login.dataUser.name
    })
  },
  methods: {
    capitalize(str) {
      return capitalizeLetter(str);
    }
  },
  mounted() {
    // Keep in active
    this.active = this.$route.path;
    if (this.role === 'ROLE_ADMIN') this.menuList.push({
      name: 'Accounts',
      icon: "card-account-details",
      path: "/account"
    })

  }
};
</script>



<style lang="scss" scoped>
.menu-btn:hover {
  background: #ecececad;
}

.custom-padding {
  padding: 0.3rem;
}

.no-margin-right {
  margin-right: 0;
}

.profile-pict {
  // clip: rect(0px,60px,60px,0px);
  max-height: 52px;
  max-width: 52px;
  min-height: 52px;
  min-width: 52px;
}

.logout:hover {
  background-color: #ffffff23;
}
</style>
