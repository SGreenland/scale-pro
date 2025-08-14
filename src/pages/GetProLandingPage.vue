<template>
  <modal-wrapper :mask="false" :has-close-button="false">
    <div v-if="!success">
      <h2 class="text-2xl">Upgrade to Scale Maestro Pro!</h2>
      <div class="my-2">£3.99 /month or £39.99 /year</div>
      <div class="flex items-center w-fit m-auto gap-2">
        Monthly<toggle-switch
          :show-on-off-text="false"
          v-model="isYearly"
          class="mt-2"
        />Yearly
      </div>
      <hr class="my-4" />
      <p class="my-2"><b>What's included:</b></p>
      <ul class="feature-list pl-5 flex flex-col gap-2">
        <li>Over 20 premium scales and arpeggios</li>
        <li>Save your settings and pitch data</li>
        <li>Priority support</li>
        <li>Exclusive access to new tools</li>
        <li class="more">And much more!</li>
      </ul>
      <submit-button
        class="mt-3 w-3/4 mx-auto"
        @click="startCheckout"
        :is-submitting="loading"
      >
        {{ loading ? "Redirecting..." : "Get Pro Now!" }}
      </submit-button>
    </div>
    <!--success content-->
    <div class="grid gap-2" v-else>
      <h2 class="text-xl mb-2">Thanks for upgrading!</h2>
      <p>Your subscription is now active.</p>
      <p>
        You can manage your subscription from
        <a href="/my-account">your account</a>.
      </p>
      <button class="mt-4 w-3/4 mx-auto">
        <a class="w-full" href="/">Start Practicing!</a>
      </button>
    </div>
  </modal-wrapper>
</template>

<script setup lang="ts">
import ModalWrapper from "../components/reuseable/ModalWrapper.vue";
import axios from "axios";
import { ref } from "vue";
import SubmitButton from "../components/reuseable/SubmitButton.vue";
import ToggleSwitch from "../components/reuseable/ToggleSwitch.vue";

const loading = ref(false);
const isYearly = ref(false);

const queryParams = new URLSearchParams(window.location.search);
const success = queryParams.get("success") === "true";

const startCheckout = async () => {
  loading.value = true;

  try {
    const { data } = await axios.post("/api/stripe/create-checkout-session", {
      isYearly: isYearly.value,
    });

    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error("No checkout URL returned.");
    }
  } catch (err) {
    console.error("Checkout error:", err);
    alert("Something went wrong creating the checkout session.");
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.feature-list li:not(.more)::before {
  content: "✔️";
  margin-right: 0.5rem;
  font-weight: bold;
}

button a,
button a:hover {
  all: unset;
}
</style>
