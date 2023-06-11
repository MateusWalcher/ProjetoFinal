<template>
  <div class="movie-card" @click="openDialog">
    <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
    <h5>{{ movie.title }}</h5>

    <div class="movie-card-content">
      <div class="movie-card-buttons">
        <q-btn
          color="primary"
          v-if="!favorite"
          @click.stop="$emit('favorite')"
          icon="favorite_border"
          class="movie-card-button"
        >
          Favoritar
        </q-btn>
        <q-btn
          color="primary"
          v-else
          @click.stop="$emit('favorite')"
          icon="favorite"
          class="movie-card-button"
        >
          Favorito
        </q-btn>
      </div>
    </div>

    <q-dialog v-model="dialogOpen" persistent>
      <q-card>
        <q-card-section>
          <h4>{{ movie.title }}</h4>
          <p>{{ movie.overview }}</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Fechar" @click="closeDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: {
    movie: Object,
    favorite: Boolean,
    watchlist: Boolean,
  },
  data() {
    return {
      dialogOpen: false,
    };
  },
  methods: {
    getImageUrl(posterPath) {
      if (posterPath) {
        return `https://image.tmdb.org/t/p/w300${posterPath}`;
      }
      return 'https://via.placeholder.com/300x450?text=No+Image';
    },
    openDialog() {
      this.dialogOpen = true;
    },
    closeDialog() {
      this.dialogOpen = false;
    },
  },
};
</script>

<style scoped>
.movie-card {
  position: relative;
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
}

.movie-card img {
  width: 75%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 8px;
}

.movie-card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.movie-card-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.movie-card-button {
  flex-grow: 1;
  margin-right: 8px;
}
</style>
