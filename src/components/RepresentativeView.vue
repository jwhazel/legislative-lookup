<template>
  <div class="representative-container">
    <div class="representative-container__bio">
      <img
        class="thumbnail"
        :class="metaData.party"
        :src="metaData.image || DefaultAvatar"
        @error="metaData.image=DefaultAvatar"
      />
      <div class="representative-container__bio-container">
        <div class="representative-container__bio-name">
          {{metaData.name}}
          <span v-if="metaData.party">({{metaData.party}})</span>
        </div>
        <div>{{metaData.office}}</div>
      </div>
    </div>

    <div class="representative-container__contact-container">
      <ul>
        <li v-if="metaData.address">
          <div class="icon-container">
            <EditIcon />
          </div>
          <div>
            {{metaData.address.line1}}
            <br />
            {{metaData.address.city}}, {{metaData.address.state}} {{metaData.address.zip}}
          </div>
        </li>
        <li v-if="metaData.email">
          <div class="icon-container">
            <MailIcon />
          </div>
          <div>
            <a :href="`mailto:${metaData.email}`">{{metaData.email}}</a>
          </div>
        </li>
        <li v-if="metaData.phone">
          <div class="icon-container">
            <PhoneIcon />
          </div>
          <div>
            <a :href="`tel:${metaData.phone}`">{{metaData.phone}}</a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { PhoneIcon, MailIcon, EditIcon } from "vue-feather-icons";
import DefaultAvatar from "../assets/avatar.png";

export default {
  name: "RepresentativeView",
  props: { metaData: { type: Object } },
  components: { PhoneIcon, MailIcon, EditIcon },
  data: function() {
    return { DefaultAvatar };
  }
};
</script>

<style scoped>
.representative-container {
  padding: 2em;
}

.representative-container__bio {
  display: flex;
  align-items: center;
}

.representative-container__bio-container {
  padding-left: 15px;
  flex: 1;
}

.thumbnail {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 3px solid #888;
  object-fit: cover;
  object-position: center;
}

.thumbnail.D {
  border-color: blue;
}

.thumbnail.R {
  border-color: red;
}

.representative-container__bio-name {
  font-size: 18px;
  font-weight: bold;
}

.icon-container {
  padding-right: 14px;
}

ul {
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
</style>