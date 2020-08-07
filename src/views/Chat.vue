<template>
  <div class="container-fluid mt-4">
    <div class="mb-3">
      <span class="mb-0 h2 text-primary">{{ roomName }}</span>
      <span class="ml-1">
        Hosted by: <strong class="text-danger">{{ hostDisplayName }}</strong>
      </span>
    </div>
    <div class="row">
      <div class="col-md-8"></div>
      <div class="col-md-4">
        <button class="btn btn-primary mr-1">
          Join
        </button>
        <button type="button" class="btn btn-danger mr-1">
          Leave
        </button>
        <h4 class="mt-2">Attendees</h4>
        <ul class="list-unstyled">
          <li>
            <span class="mr-2" title="On Air">
              <font-awesome-icon icon="podcast"></font-awesome-icon>
            </span>
            <span></span>
            <span class="pl-1"></span>
          </li>
        </ul>
        <div>
          <h5 class="mt-4">Pending</h5>
          <ul class="list-unstyled">
            <li class="mb-1" v-for="attendee in attendeesPending" :key="attendee.id">
              <span>
                <a type="button" class="mr-2" title="Approve attendee">
                  <font-awesome-icon icon="user"></font-awesome-icon>
                </a>
                <a type="button" class="text-secondary pr-1" title="Delete Attendee">
                  <font-awesome-icon icon="trash"></font-awesome-icon>
                </a>
              </span>
              <span class="pl-1">{{ attendee.displayName }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <p class="lead">
        Hi <strong class="text-primary font-weight-bold"></strong>, you're currently in the room
        waiting for the owner of the chat to add you to the meeting. Please wait.
      </p>
    </div>
  </div>
</template>
<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import db from '../db.js'
export default {
  name: 'Attendees',
  data: function() {
    return {
      attendeesPending: [],
      hostID: this.$route.params.hostID,
      roomID: this.$route.params.roomID,
      roomName: null,
      hostDisplayName: null
    }
  },
  components: {
    FontAwesomeIcon
  },
  props: ['user'],
  mounted() {
    const roomRef = db
      .collection('users')
      .doc(this.hostID)
      .collection('rooms')
      .doc(this.roomID)

    //Get Room Name
    roomRef.get().then(roomDocument => {
      if (roomDocument.exists) {
        this.roomName = roomDocument.data().name
      } else {
        this.$router.replace('/')
      }
    })

    roomRef.collection('attendees').onSnapshot(attendeeSnapshot => {
      const tempPending = []
      let amCheckedIn = false

      attendeeSnapshot.forEach(attendeeDocument => {
        if (this.user.uid == attendeeDocument.id) {
          amCheckedIn = true
        }

        if (this.hostID == attendeeDocument.id) {
          this.hostDisplayName = attendeeDocument.data().displayName
        }
        tempPending.push({
          id: attendeeDocument.id,
          eMail: attendeeDocument.data().eMail,
          displayName: attendeeDocument.data().displayName,
          approved: attendeeDocument.data().approved,
          webRTCID: attendeeDocument.data().webRTCID
        })
      })
      this.attendeesPending = tempPending
      if (!amCheckedIn) {
        this.$router.push(`/checkin/${this.hostID}/${this.roomID}`)
      }
    })
  }
}
</script>
