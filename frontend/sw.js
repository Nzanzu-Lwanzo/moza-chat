self.addEventListener("push", function ({ data }) {
  console.log(data, " received from web-push on the backend !");
});
