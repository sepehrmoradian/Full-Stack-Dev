<template>
  <div>
    <h1 class="border">Hello {{ currentUser.username }} !</h1>
    <p class="heading">Posts from people and places you follow</p>
    <div v-if =  "currentUser.username === 'adminbob'">
      <b-button class="delete" @click="deletePosts()"> Delete </b-button>
    </div>
    <div
      class="row justify-content-center"
      style="padding: 2rem"
      v-for="post in posts"
      v-bind:key="post._id"
    >
      <div>{{ removeOrAdd(post._id) }}</div>
      <b-card
        style="card"
        header-tag="header"
        footer-tag="footer"
        class="card"
        no-body
      >
        <b-tabs card>
          <template #tabs-start>
            <li role="presentation" class="nav-item align-self-center">
              @{{ post.userName }}
            </li>
          </template>

          <b-tab title="Post">
            <b-card-text class="scroll">
              <p class="desc">{{ post.description }}</p>
            </b-card-text>
          </b-tab>
          <b-tab title="Reviews">
            <b-card-text class="scroll">
              <Post v-bind:post="post" />
            </b-card-text>
          </b-tab>

          <b-tab title="Write a Review">
            <b-input-group size="lg" prepend="Text" class="mb-3" name="text">
              <b-form-input v-model="text"></b-form-input>
            </b-input-group>
            <b-form-rating size="lg" v-model="rating" class="stars">
            </b-form-rating>
            <p class="mt-2">Rating: {{ rating }}</p>
            <b-button
              class="post-b"
              pill
              variant="success"
              @click="createReview(post)"
            >
              Post
            </b-button>
          </b-tab>
        </b-tabs>
        <template #footer>
          <i class="fa-solid fa-location-dot"></i>
          <p>{{ post.location }}</p>
          <b-button id="tripbooking" @click="tripBookIt(post)">
            <i class="fa-solid fa-book-open"> </i> {{ message }}
          </b-button>
        </template>
      </b-card>
    </div>
  </div>
</template>

<script>
import Post from '../components1/Post.vue'
import { Api } from '@/Api'

export default {
  name: 'posts',
  props: { currentUser: Object },
  components: { Post },
  mounted() {
    if (localStorage.getItem('token')) {
      console.log(this.currentUser)
    }
    Api.get('/posts')
      .then((response) => {
        console.log(response.data)
        this.posts = response.data.posts
        console.log(this.posts)
      })
      .catch((error) => {
        console.error(error)
      })
  },

  methods: {
    createReview(post) {
      const newReview = {
        rating: this.rating,
        text: this.text,
        userName: this.currentUser.username
      }
      console.log('hello')
      console.log(post)
      console.log(post._id)
      console.log('hello')
      Api.post(`/posts/${post._id}/reviews`, newReview)
        .then((response) => {
          console.log(response.data)
          this.review = []
          this.review.push(newReview)
          console.log()
        })
        .catch((error) => {
          console.log(error)
        })
      this.$router.go(0)
    },
    tripBookIt(post) {
      const theID = this.currentUser.id
      let route = '/userFavPost/' + theID
      if (localStorage.getItem('place')) {
        route = '/placeFavPost/' + theID
      }
      Api.post(route, post)
        .then((response) => {
          console.log(response.data)
          location.reload()
        })
        .catch((error) => {
          console.log(error)
        })
      console.log(this.currentUser.favPosts)
    },
    removeOrAdd(post) {
      if (this.currentUser.favPosts.includes(post)) {
        this.message = 'Remove from tripbook'
      } else {
        this.message = 'Tripbook it!'
      }
    },
    deletePosts() {
      Api.delete('/posts').then((res) => {
        this.message = 'Posts were delete'
        location.reload()
      })
        .catch(error => {
          console.error(error)
        })
    }
  },

  data() {
    return {
      posts: [],
      rating: null,
      message: ''
    }
  }
}
</script>

<style scoped>
#tripbooking {
  float: right;
  background-color: #f6eef0;
  padding: 3px;
  border: 1px solid gray;
  color: black;
}
#tripbooking:hover {
  background-color: #f6eef073;
}
.header {
  text-align: center;
  font-weight: bold;
  border-top: 0ch;
}

.heading {
  font-weight: bold;
  text-align: center;
}

.desc {
  font-weight: bold
}

.card {
  width: 650px;
  height: 600px;
}

li {
  padding-right: 1.5rem;
  padding-left: 0.5rem;
  font-weight: bold;
}

footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  max-height: 100px;
  font-weight: bold;
}

.scroll {
  min-width: 600px;
  min-height: 430px;
  max-height: 430px;
  max-width: 600px;
  overflow-y: auto;
  padding: 0rem;
  margin-bottom: 3rem !important;
}

.border {
  font-family: sans-serif;
  text-align: center;
  font-weight: bold;
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
  background-color: #4c3d40;
  color: white;
}

.mb-3 {
  margin-top: 3rem;
}

.stars {
  margin-top: 3rem;
}

.post-b {
  margin-top: 2rem;
  width: 100%;
}

.delete {
  margin-left: 40rem;
}

@media only screen and (max-width: 575.98px) {
  .card {
    width: 500px;
    height: 500px;
  }
  .desc {
    margin-bottom: 8px;
    max-height: 315px;
  }
  .scroll {
    min-width: 250px;
    min-height: 300px;
    max-height: 300px;
    max-width: 250px;
  }
}
@media only screen and (min-width: 576px) and (max-width: 767.98px) {
  .card {
    width: 500px;
    height: 500px;
  }
  .desc {
    margin-bottom: 8px;
    max-height: 315px;
  }
  .scroll {
    min-width: 420px;
    min-height: 330px;
    max-height: 330px;
    max-width: 420px;
  }
}

@media only screen and (min-width: 768px) and (max-width: 991.98px) {
  .card {
    width: 500px;
    height: 500px;
  }
  .desc {
    max-height: 340px;
  }
  .scroll {
    min-width: 420px;
    min-height: 330px;
    max-height: 330px;
    max-width: 420px;
  }
}
@media only screen and (min-width: 992px) and (max-width: 1199.98px) {
  .card {
    width: 500px;
    height: 500px;
  }
  .desc {
    margin-bottom: 8px;
    max-height: 355px;
  }
  .scroll {
    min-width: 420px;
    min-height: 330px;
    max-height: 330px;
    max-width: 420px;
  }
}
@media only screen and (min-width: 1200px) {
  .card {
    width: 500px;
    height: 500px;
  }
  .desc {
    margin-bottom: 8px;
    max-height: 355px;
  }
  .scroll {
    min-width: 420px;
    min-height: 330px;
    max-height: 330px;
    max-width: 420px;
  }
}
</style>
