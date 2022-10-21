export const submitform = {
  methods: {
    submitForm(res) {
      res.disabled = true;
      setTimeout(async () => {
        res.Notification = res.value;
        res.disabled = false;
        var obj = { name: res.Name, value: res.value };
        let response = await fetch("https://localhost:5001/api/Home", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(obj),
        });
        let result = await response.json();
        alert(result.message);
      }, 1000);
    },
  },
};
