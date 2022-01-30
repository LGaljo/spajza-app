import {DateTime} from "luxon";

export default {
  methods: {
    formatDateTime(time) {
      return DateTime.fromISO(time).toFormat('dd. MM. yyyy HH:mm')
    },
    formatDate(time) {
      return DateTime.fromISO(time).toFormat('dd. MM. yyyy')
    },
  }
}
