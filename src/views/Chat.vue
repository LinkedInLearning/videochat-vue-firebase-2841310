<template>
  <div class="container-fluid mt-4">
    <div class="mb-3">
      <span class="mb-0 h2 text-primary">{{ roomName }}</span>
      <span class="ml-1" v-if="user !== null && user.uid !== hostID">
        Hosted by: <strong class="text-danger">{{ hostDisplayName }}</strong>
      </span>
    </div>

    <div class="row" v-if="(user !== null && user.uid == hostID) || attendeeApproved">
      <div class="col-md-8"></div>
      <div class="col-md-4">
        <button
          v-if="!attendeeJoined && attendeeApproved"
          class="btn btn-primary mr-1"
          @click="doJoin"
        >
          Join
        </button>
        <button v-if="attendeeJoined" type="button" class="btn btn-danger mr-1" @click="doLeave">
          Leave
        </button>

        <h4 class="mt-2">Attendees</h4>
        <ul class="list-unstyled">
          <li v-for="attendee in attendeesApproved" :key="attendee.id">
            <span class="mr-2" v-if="user !== null && user.uid == hostID" title="On Air">
              <a
                type="button"
                class="mr-2"
                title="Approve attendee"
                @click="toggleApproval(attendee.id)"
              >
                <font-awesome-icon icon="user"></font-awesome-icon>
              </a>
              <font-awesome-icon icon="podcast"></font-awesome-icon>
            </span>

            <span
              class="pl-1"
              :class="[attendee.id == user.uid ? 'font-weight-bold text-danger' : '']"
              >{{ attendee.displayName }}</span
            >
          </li>
        </ul>
        <div v-if="user !== null && user.uid == $route.params.hostID">
          <h5 class="mt-4">Pending</h5>
          <ul class="list-unstyled">
            <li class="mb-1" v-for="attendee in attendeesPending" :key="attendee.id">
              <span v-if="user !== null && user.uid == hostID">
                <a
                  type="button"
                  class="mr-2"
                  :class="[attendee.approved ? 'text-secondary' : '', 'text-secondary']"
                  title="Approve attendee"
                  @click="toggleApproval(attendee.id)"
                >
                  <font-awesome-icon icon="user"></font-awesome-icon>
                </a>
                <a
                  type="button"
                  class="text-secondary pr-1"
                  title="Delete Attendee"
                  @click="deleteAttendee(attendee.id)"
                >
                  <font-awesome-icon icon="trash"></font-awesome-icon>
                </a>
              </span>
              <span
                class="pl-1"
                :class="[attendee.id == user.uid ? 'font-weight-bold text-danger' : '']"
                >{{ attendee.displayName }}</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="lead" v-if="user">
        Hi <strong class="text-primary font-weight-bold">{{ user.displayName }}</strong
        >, you're currently in the room waiting for the owner of the chat to add you to the meeting.
        Please wait. {{ attendeeApproved }}
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
      attendeesApproved: [],
      attendeesPending: [],
      attendeeApproved: false,
      attendeeJoined: false,
      hostID: this.$route.params.hostID,
      roomID: this.$route.params.roomID,
      roomName: null,
      hostDisplayName: null
    }
  },
  components: {
    FontAwesomeIcon
  },
  methods: {
    toggleApproval: function(attendeeID) {
      if (this.user && this.user.uid == this.hostID) {
        const ref = db
          .collection('users')
          .doc(this.user.uid)
          .collection('rooms')
          .doc(this.roomID)
          .collection('attendees')
          .doc(attendeeID)

        ref.get().then(attendeeDocument => {
          const approved = attendeeDocument.data().approved
          if (approved) {
            ref.update({
              approved: !approved
            })
          } else {
            ref.update({
              approved: true
            })
          }
        })
      }
    },
    deleteAttendee: function(attendeeID) {
      if (this.user && this.user.uid == this.hostID) {
        db.collection('users')
          .doc(this.user.uid)
          .collection('rooms')
          .doc(this.roomID)
          .collection('attendees')
          .doc(attendeeID)
          .delete()
      }
    }
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
      const tempApproved = []
      let amCheckedIn = false

      attendeeSnapshot.forEach(attendeeDocument => {
        if (this.user.uid == attendeeDocument.id) {
          amCheckedIn = true
        }

        if (this.hostID == attendeeDocument.id) {
          this.hostDisplayName = attendeeDocument.data().displayName
        }

        if (attendeeDocument.data().approved) {
          if (this.user.uid == attendeeDocument.id) {
            this.attendeeApproved = true
          }

          tempApproved.push({
            id: attendeeDocument.id,
            displayName: attendeeDocument.data().displayName,
            approved: attendeeDocument.data().approved
          })
        } else {
          if (this.user.uid == attendeeDocument.id) {
            this.attendeeApproved = false
          }
          tempPending.push({
            id: attendeeDocument.id,
            displayName: attendeeDocument.data().displayName,
            approved: attendeeDocument.data().approved
          })
        }
      })
      this.attendeesApproved = tempApproved
      this.attendeesPending = tempPending
      if (!amCheckedIn) {
        this.$router.push(`/checkin/${this.hostID}/${this.roomID}`)
      }
    })
  }
}
</script>
