import { defineStore } from "pinia";
import axios from "axios";
const baseUrl = "https://flimsy-bedroom-production.up.railway.app/customer";
export const useCounterStore = defineStore("counter", {
  state() {
    return {
      products: [],
      categories: [],
      product: {},
      isLogin: false,
      name: "",
      province: [],
      city: [],
      cost: {},
      order: [],
      page: "",
      totalPage: "",
    };
  },
  actions: {
    clearCost() {
      this.cost = {};
    },
    async register(user) {
      try {
        await axios({
          method: "post",
          url: baseUrl + "/register",
          data: user,
        });
        this.router.push("/login");
        Swal.fire({
          title: "Register Berhasil",
        });
      } catch (error) {
        Swal.fire(error.response.data.message);
      }
    },
    async login(user) {
      try {
        const { data } = await axios({
          method: "post",
          url: baseUrl + "/login",
          data: user,
        });
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("name", data.name);
        this.name = localStorage.getItem("name");
        this.isLogin = true;
        this.router.push("/");
        // console.log("berhasil login");
        Swal.fire({
          title: "Login Berhasil",
        });
      } catch (error) {
        Swal.fire(error.response.data.message);
      }
    },
    async logout() {
      try {
        localStorage.clear();
        this.isLogin = false;
        this.router.push("/login");
        Swal.fire({
          title: "Log Out Berhasil",
        });
      } catch (error) {
        Swal.fire(error.response.data.message);
      }
    },
    async fetchProducts(pageNow = 1) {
      try {
        const { data } = await axios({
          method: "get",
          url: baseUrl + "/?page[size]=5&page[number]=" + pageNow,
        });
        this.products = data.data;
        this.totalPage = data.totalPage;
      } catch (error) {
        Swal.fire(error.response.data.message);
      }
    },
    async fetchProductId(id) {
      try {
        const { data } = await axios({
          method: "get",
          url: baseUrl + "/detail/" + id,
          headers: {
            access_token: localStorage.access_token,
          },
        });
        this.product = data;
        // console.log(this.oneNews);
      } catch (error) {
        Swal.fire(error.response.data.message);
      }
    },
    async fetchCategories() {
      try {
        const { data } = await axios({
          method: "get",
          url: baseUrl + "/categories",
          headers: {
            access_token: localStorage.access_token,
          },
        });
        this.categories = data;
        // console.log(data);
      } catch (error) {
        Swal.fire(error.response.data.message);
      }
    },
    async fetchCategoriesById(id) {
      // console.log(id);
      try {
        const { data } = await axios({
          method: "get",
          url: baseUrl + "/categories/" + id,
          headers: {
            access_token: localStorage.access_token,
          },
        });
        this.products = data.Products;
        // console.log(data);
      } catch (error) {
        Swal.fire(error.response.data.message);
      }
    },
    async getProvince() {
      try {
        const { data } = await axios({
          method: "get",
          url: baseUrl + "/province",
          headers: {
            access_token: localStorage.access_token,
          },
        });
        this.province = data.data;
        // console.log(data.data);
      } catch (error) {
        // console.log(error);
        Swal.fire(error.response.data.message);
      }
    },
    async getCity(provinceId) {
      try {
        const { data } = await axios({
          method: "get",
          url: baseUrl + "/city/" + provinceId,
          headers: {
            access_token: localStorage.access_token,
          },
        });
        this.city = data.data;
      } catch (error) {
        // console.log(error);
        Swal.fire(error.response.data.message);
      }
    },

    async getCost(cityId) {
      try {
        const { data } = await axios({
          method: "get",
          url: baseUrl + "/cost?destination=" + cityId,
          headers: {
            access_token: localStorage.access_token,
          },
        });
        this.cost = data;
      } catch (error) {
        // console.log(error);
        Swal.fire(error.response.data.message);
      }
    },

    async createOrders(id) {
      try {
        const { data } = await axios({
          method: "post",
          url: baseUrl + "/buy/" + id,
          headers: {
            access_token: localStorage.access_token,
          },
        });
        this.router.push("/");
      } catch (error) {
        // console.log(error);
        Swal.fire(error.response.data.message);
      }
    },

    async payment(harga, id) {
      try {
        const { data } = await axios({
          method: "post",
          url: baseUrl + "/generate-midtrans-token?cost=" + harga,
          headers: {
            access_token: localStorage.access_token,
          },
        });
        const cb = this.createOrders;
        window.snap.pay(data.token, {
          onSuccess: function (result) {
            /* You may add your own implementation here */
            cb(id);
            // alert("payment success!");
            swall.fire("payment success!");
            // console.log(result);
          },
          onPending: function (result) {
            /* You may add your own implementation here */
            // alert("wating your payment!");
            swall.fire("wating your payment!");
            // console.log(result);
          },
          onError: function (result) {
            /* You may add your own implementation here */
            // alert("payment failed!");
            swall.fire("payment failed!");
            // console.log(result);
          },
          onClose: function () {
            /* You may add your own implementation here */
            Swal.fire("you closed the popup without finishing the payment");
            // alert("you closed the popup without finishing the payment");
          },
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getOrder() {
      try {
        const { data } = await axios({
          method: "get",
          url: baseUrl + "/order",
          headers: {
            access_token: localStorage.access_token,
          },
        });
        this.order = data;
      } catch (error) {
        // console.log(error);
        Swal.fire(error.response.data.message);
      }
    },
  },
});
