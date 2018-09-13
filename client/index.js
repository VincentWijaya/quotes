const base_url = 'http://localhost:3000'

const localData = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : ''

const token = localData[0].token
const email = localData[1].email

let app = new Vue({
  el: '#app',
  data: {
    email: '',
    password: '',
    error: '',
    token: token,
    quote: '',
    quotes: [],
    translateShow: false
  },
  methods: {
    login: function() {
      let self = this
      
      axios({
        method: 'POST',
        url: `${base_url}/users/login`,
        data: {
          email: this.email,
          password: this.password
        }
      })
        .then(response => {
          localStorage.setItem('data', JSON.stringify([{token: response.data.token}, {email: self.email}]))
          self.token = response.data.token
          self.password = ''
        })
        .catch(error => {
          if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              self.error = ''
              self.error = 'Login gagal!'
              // console.log(error.response.status);
              // console.log(error.response.headers);
          } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
          } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
          }
        })
    },
    logout: function() {
      localStorage.removeItem('token')
      this.token = ''
      this.email = ''
    },
    createQuote: function() {
      let self = this
      
      axios({
        method: 'POST',
        url: `${base_url}/quotes`,
        data: {
          status: self.quote
        },
        headers: {
          token: token
        }
      })
        .then(response => {
          response.data['isHim'] = true
          self.quotes.push(response.data)
          self.quote = ''
        })
        .catch(error => {
          console.log(error)
        })
    }
    // delete: function() {
    //   axios({
    //     method: 'DELETE',
    //     url: `${base_url}/quotes/`
    //   })
    // }
  },
  created() {
    let self = this
    
    axios({
      method: 'GET',
      url: `${base_url}/quotes`
    })
      .then(response => {
        response.data.forEach(quote => {
          if (quote.user.email == email) {
            quote['isHim'] = true
          } else {
            quote['isHim'] = false
          }
        })
        self.quotes = response.data
      })
      .catch(error => {
        console.log(error);
      })
  },
  computed: {
    isHim: function() {
      this.quotes.forEach(quote => {
        if (quote.isHIm) {
          return true
        }
      })
    }
  }
})