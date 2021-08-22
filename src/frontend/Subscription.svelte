<script lang="ts">

    export interface FrontendDefinitions {
        root : string,
        slug : string,
        nonce : string,
        version : string,
        base: string,
        active: string
    }

    declare var remind_me_definitions : FrontendDefinitions;

    const param = new URLSearchParams(window.location.search);

    console.log(param);

    let email : string = "";

    const handleSubmit = (e : Event) => {
        e.preventDefault();
        console.log(email);
    }

</script>

<style lang="scss">

  $indigo: rgba(99,102,241,1);
  $red: #dc3545;

    main {
      font-family: Inter var,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji" !important;
      background-color: white !important;
      padding: 1.5em !important;
      margin: 35px 0 !important;
      border-radius: 5px !important;
      box-shadow: 0 5px 20px 1px rgba(0,0,0,0.62) !important;
    }

    h4 {
      font-size: 28px !important;
      margin-top: 0 !important;
      padding-bottom: 4px;
      text-align: center !important;
    }

    form {
      input[type="email"] {
        display: block !important;
        margin-top: 3px !important;
        padding: 8px 10px !important;
        line-height: 20px !important;
        font-size: 14px !important;
        border-radius: 3px !important;
        border-width: 1px !important;
        width: 100% !important;
        color: #212529 !important;
        appearance: none !important;
        border-color: rgba(209,213,219,1) !important;
        box-shadow: 0 0 #000, 0 0 #000, 0 1px 2px 0 rgba(0,0,0,0.05)!important;

        &:disabled {
          color: gray !important;
        }

        &:focus {
          outline: none !important;
          border-color: $indigo !important;
          box-shadow: 0 0 0 1px #2563eb !important;
        }

        &:focus-visible {
          outline: none !important;
          border-color: $indigo !important;
          box-shadow: 0 0 0 1px #2563eb !important;
        }
      }
    }

    .row {
      padding-bottom: 15px !important;
    }
</style>

<main>
    <h4>Subscription Settings</h4>
    <form on:submit={handleSubmit}>
        <div class="row">
            <label>Events</label>
        </div>
        <div class="row">
            <label for="email">Email address</label>
            <input
                id="email"
                type="email"
                bind:value={email}
            >
        </div>
    </form>
</main>