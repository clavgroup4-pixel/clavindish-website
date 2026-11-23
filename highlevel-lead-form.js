/*
 * Clavindish Group – sends the "Request a callback" form (#cbForm) to HighLevel.
 * HighLevel workflow: "Website callback form – clavindishgroup.com" (Inbound Webhook trigger).
 * Uses an inbound webhook, so no API key is exposed in the site code.
 */
(function () {
  var HIGHLEVEL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/WI52nYksUYKQB6F9cCn9/webhook-trigger/633debd1-0937-4a79-8780-122fbdaac1f6";

  function val(form, name) {
    var el = form.elements[name];
    return el && el.value ? String(el.value).trim() : "";
  }

  function init() {
    var form = document.getElementById("cbForm");
    if (!form) return;

    // Capture phase: runs before the site's own handler disables the fields.
    form.addEventListener("submit", function () {
      var fullName = val(form, "name");
      var parts = fullName.split(/\s+/);
      var data = {
        full_name: fullName,
        first_name: parts.shift() || "",
        last_name: parts.join(" "),
        phone: val(form, "phone"),
        email: val(form, "email"),
        preferred_time: val(form, "time"),
        interest: val(form, "topic"),
        message: val(form, "msg"),
        consent: "yes",
        source: "clavindishgroup.com – Request a callback",
        page_url: location.href
      };
      var body = new URLSearchParams(data).toString();

      // Form-encoded "simple" request: no CORS preflight from a static site.
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: "application/x-www-form-urlencoded" });
        if (navigator.sendBeacon(HIGHLEVEL_WEBHOOK_URL, blob)) return;
      }
      fetch(HIGHLEVEL_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body
      }).catch(function () {});
    }, true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
