<template>
  <b-card no-body class="mt-3 mb-1">
    <b-card-header header-tag="header" class="p-0" role="tab">
      <b-button block v-b-toggle.accordion-2 variant="outline" class="py-3">Komentarji</b-button>
    </b-card-header>

    <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel" v-model="visible">
      <b-card-body>
        <b-card-text>
          <b-card
            v-if="comments.length !== 0"
            v-for="(comment, key) of comments"
            :key="comment._id"
            :class="['d-flex', 'flex-column', { 'border-bottom': key !== comment.length - 1}]"
          >
            <!-- Original comment -->
            <div>
              <div class="d-flex justify-content-between mb-2">
                <b-badge variant="light" class="p-2">
                  <b>{{ comment.user.username }}</b> -
                  {{ formatDateTime(comment._createdAt) }}
                </b-badge>
              </div>
              <div class="my-1">{{ comment.message }}</div>
              <b-btn size="sm" @click="replyToActive = true">Odgovori</b-btn>
              <b-btn v-if="isAdmin" size="sm" variant="danger" @click="deleteComment(reply)">Izbriši</b-btn>
            </div>

            <!-- Replies to comment -->
            <div v-if="comment?.replies?.length">
              <hr/>
              <div class="ml-3">
                <div v-for="reply in comment.replies" :key="reply._id" class="mb-3">
                  <b-badge variant="light" class="p-2">
                    <b>{{ reply.user.username }}</b> -
                    {{ formatDateTime(reply._createdAt) }}
                  </b-badge>
                  <div class="my-1">{{ reply.message }}</div>
                  <b-btn v-if="isAdmin" size="sm" variant="danger" @click="deleteComment(reply)">Izbriši</b-btn>
                </div>
              </div>
            </div>

            <!-- Reply input -->
            <div v-if="replyToActive" class="mt-2">
              <b-form @submit.prevent="reply(comment)">
                <b-textarea v-model="form.message" placeholder="Napiši odgovor"/>
                <b-btn type="submit" variant="primary" class="mt-1">Pošlji</b-btn>
              </b-form>
            </div>
          </b-card>

          <div v-else class="text-center">
            <b>Ni komentarjev</b>
          </div>

          <div class="mt-3">
            <div class="text-right">
              <b-btn v-if="!commentActive" @click="commentActive = true">Dodaj komentar</b-btn>
            </div>
            <b-form v-if="commentActive" @submit.prevent="addComment">
              <b-textarea v-model="form.message" placeholder="Napiši kaj ti roji po glavi" />
              <b-btn type="submit" variant="primary" class="mt-1">Pošlji</b-btn>
            </b-form>
          </div>
        </b-card-text>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import datetime from "../mixins/datetime";
import {mapActions, mapGetters} from "vuex";
import roles from "~/mixins/roles";

export default {
  name: "Comments",
  mixins: [datetime, roles],
  props: {
    comments: Array
  },
  data: () => ({
    visible: true,
    replyToActive: false,
    commentActive: false,
    form: {
      message: null
    },
  }),
  computed: {
    ...mapGetters({
      isAdmin: 'user/isAdmin',
    }),
  },
  methods: {
    ...mapActions({
      post: 'comments/postComment',
      delete: 'comments/remove'
    }),
    async reply(comment) {
      await this.post({
        parent_comment_id: comment._id,
        message: this.form.message,
      })
      this.form.message = null;
      this.replyToActive = false
    },
    async addComment() {
      await this.post({
        parent_comment_id: null,
        message: this.form.message,
      })
      this.form.message = null;
      this.commentActive = false
    },
    async deleteComment(comment) {
      await this.delete(comment._id)
    }
  }
}
</script>

<style scoped>

</style>
