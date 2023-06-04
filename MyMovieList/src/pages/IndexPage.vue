<template>
  <div class="index-page">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://images.vexels.com/media/users/3/140256/isolated/preview/8dfa6aefbd0dc3bff61b96d7f2f7ff40-icone-de-tira-de-filme.png">
          </q-avatar>
          MyMovieList
        </q-toolbar-title>
        <q-btn class="logout-button" @click="logout">Logout</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" :width="150" bordered>
      <q-list>
        <q-item
          v-for="item in menuItems"
          :key="item.title"
          clickable
          @click="navigate(item.route)"
          :class="{ active: activeRoute === item.route }"
        >
          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="q-pa-md">
      <div class="q-gutter-md">
        <div class="q-col">
          <div class="q-pa-md">
            <div class="q-row movie-cards movie-container">
              <MovieCard
                v-for="movie in displayedMovies"
                :key="movie.id"
                :movie="movie"
                :favorite="isMovieFavorite(movie.id)"
                class="q-col-md-3"
                @favorite="toggleFavorite(movie.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </q-page-container>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { signOut } from 'firebase/auth'
import axios from 'axios'
import MovieCard from '../components/MovieCard.vue'
import auth from 'boot/firebase.js'

export default defineComponent({
  name: 'IndexPage',

  components: {
    MovieCard,
  },

  data() {
    return {
      movies: [],
      displayedMovies: [],
      activeRoute: 'allMovies',
      user: null,
      favoriteMovies: [],
    }
  },

  created() {
    this.fetchMovies()
    this.getUserData()
  },

  setup() {
    const leftDrawerOpen = ref(false)

    const menuItems = [
      { title: 'Início', route: 'allMovies' },
      { title: 'Filmes em cartaz', route: 'nowPlayingMovies' },
      { title: 'Favoritos', route: 'favorites' },
    ]

    return {
      leftDrawerOpen,
      menuItems,
    }
  },

  methods: {
    navigate(route) {
      this.activeRoute = route;
      switch (route) {
        case 'allMovies':
          this.displayedMovies = this.movies;
          break;
        case 'nowPlayingMovies':
          this.fetchNowPlayingMovies();
          break;
        case 'favorites':
          this.displayedMovies = this.favoriteMovies;
          break;
      }
    },

    logout() {
      signOut(auth)
        .then(() => {
          // Logout bem-sucedido, redirecionar para a tela de login
          this.$router.push('/')
        })
        .catch((error) => {
          console.error('Erro durante o logout:', error)
        })
    },

    fetchMovies() {
      // Faça a solicitação HTTP para a API do TMDB para buscar todos os filmes disponíveis
      const apiKey = '91cefdafa16990647ed1774347616e57'
      const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`

      axios
        .get(url)
        .then((response) => {
          this.movies = response.data.results
          this.displayedMovies = this.movies
        })
        .catch((error) => {
          console.error('Erro ao buscar filmes:', error)
        })
    },

    fetchNowPlayingMovies() {
      // Faça a solicitação HTTP para a API do TMDB para buscar os filmes em cartaz
      const apiKey = '91cefdafa16990647ed1774347616e57'
      const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`

      axios
        .get(url)
        .then((response) => {
          this.displayedMovies = response.data.results
        })
        .catch((error) => {
          console.error('Erro ao buscar filmes em cartaz:', error)
        })
    },

    getUserData() {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid
        // Aqui você pode adicionar a lógica para buscar os dados do usuário do Firebase
      }
    },

    isMovieFavorite(movieId) {
      return this.favoriteMovies.includes(movieId)
    },

    toggleFavorite(movieId) {
      if (this.isMovieFavorite(movieId)) {
        this.favoriteMovies = this.favoriteMovies.filter(id => id !== movieId)
      } else {
        this.favoriteMovies.push(movieId)
      }

      // Aqui você pode adicionar a lógica para atualizar os dados do usuário no Firebase
    },
  },
})
</script>

<style scoped>
.logout-button {
  margin-left: auto;
}

.q-page-container {
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.q-item.active {
  background-color: #f0f0f0;
}

.q-row.movie-cards {
  display: flex;
  flex-wrap: wrap;
}

.q-col-md-3 {
  flex: 0 0 25%;
  max-width: 25%;
}
</style>