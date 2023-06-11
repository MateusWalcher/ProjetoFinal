<template>
  <div class="index-page">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img
              src="https://images.vexels.com/media/users/3/140256/isolated/preview/8dfa6aefbd0dc3bff61b96d7f2f7ff40-icone-de-tira-de-filme.png"
            />
          </q-avatar>
          Minha Lista de Filmes
        </q-toolbar-title>
        <q-btn class="logout-button" @click="logout">Logout</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      :width="150"
      bordered
    >
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
import { defineComponent, ref } from "vue";
import { signOut} from "firebase/auth";
import axios from "axios";
import MovieCard from "../components/MovieCard.vue";
import auth from "boot/firebase.js";
import { getAuth } from "firebase/auth";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { db } from "src/boot/firebase";

export default defineComponent({
  name: "IndexPage",

  components: {
    MovieCard,
  },

  data() {
    return {
      movies: [],
      displayedMovies: [],
      activeRoute: "allMovies",
      user: null,
      favoriteMovies: [],
    };
  },



  setup() {
    const leftDrawerOpen = ref(false);

    const menuItems = [
      { title: "Início", route: "allMovies" },
      { title: "Filmes em cartaz", route: "nowPlayingMovies" },
      { title: "Favoritos", route: "favorites" },
    ];

    return {
      leftDrawerOpen,
      menuItems,
    };
  },

  mounted() {
    this.fetchMovies();
    this.getUserData();
  },

  methods: {
    navigate(route) {
      this.activeRoute = route;
      switch (route) {
        case "allMovies":
          this.displayedMovies = this.movies;
          break;
        case "nowPlayingMovies":
          this.fetchNowPlayingMovies();
          break;
        case "favorites":
          this.displayedMovies = this.movies.filter((movie) =>
            this.favoriteMovies.includes(movie.id)
          );
          break;
      }
    },

    logout() {
      signOut(auth)
        .then(() => {
          // Logout bem-sucedido, redirecionar para a tela de login
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Erro durante o logout:", error);
        });
    },

    fetchMovies() {

      const apiKey = "91cefdafa16990647ed1774347616e57";
      const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=pt-BR`;

      axios
        .get(url)
        .then((response) => {
          this.movies = response.data.results;
          this.displayedMovies = this.movies;
        })
        .catch((error) => {
          console.error("Erro ao buscar filmes:", error);
        });
    },

    fetchNowPlayingMovies() {

      const apiKey = "91cefdafa16990647ed1774347616e57";
      const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=pt-BR`;

      axios
        .get(url)
        .then((response) => {
          this.displayedMovies = response.data.results;
        })
        .catch((error) => {
          console.error("Erro ao buscar filmes em cartaz:", error);
        });
    },

    getUserData() {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userId = currentUser.uid;
        const userRef = doc(db, "users", userId);

        // Use o Firestore para buscar os dados do usuário
        getDoc(userRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              this.favoriteMovies = userData.favoriteMovies || [];
            }
          })
          .catch((error) => {
            console.error("Erro ao buscar dados do usuário:", error);
          });
      }
    },


    isMovieFavorite(movieId) {
      return this.favoriteMovies.includes(movieId);
    },

    toggleFavorite(movieId) {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (this.isMovieFavorite(movieId)) {
        this.favoriteMovies = this.favoriteMovies.filter((id) => id !== movieId);
      } else {
        this.favoriteMovies.push(movieId);
      }

      // Atualizar as informações de filmes favoritos no Firestore
      if (currentUser) {
        const userId = currentUser.uid;
        const userRef = doc(db, "users", userId);

        // Verificar se o documento com o ID do usuário existe
        getDoc(userRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              // Documento existe, atualize-o com os filmes favoritos
              setDoc(userRef, { favoriteMovies: this.favoriteMovies }, { merge: true })
                .then(() => {
                  console.log("Dados de filmes favoritos atualizados com sucesso");
                })
                .catch((error) => {
                  console.error("Erro ao atualizar dados de filmes favoritos:", error);
                });
            } else {
              // Documento não existe, crie um novo documento com o nome do ID do usuário
              setDoc(userRef, { id: userId, favoriteMovies: this.favoriteMovies })
                .then(() => {
                  console.log("Novo documento de usuário criado com sucesso");
                })
                .catch((error) => {
                  console.error("Erro ao criar novo documento de usuário:", error);
                });
            }
          })
          .catch((error) => {
            console.error("Erro ao buscar dados do usuário:", error);
          });
      }
    },

  },
});
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
  background-color: grey;
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
