// https://serviceworke.rs/push-get-payload_index_doc.html

self.addEventListener("push", e => {
  const data = e.data.json();
  var title="IoTBroker";
  var msg="";
  var icon=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAGQAAABkABchkaRQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASJSURBVFiF7ZZNbFRVFMd/5773pjOdfn8CLQWMWLEiEYgEIa4MQSKs3BCJLnSlMXEnSE1YCCbK0o1oookaFxiiicYQISagrFAoEQglFNpOG+z317Sd13fvcVEonbZTOhATE/3vZu655/97536cC/91SX7hKt67qZcRXhOR9aA+whXn9CvX2/MpxzZP/YMAKqY59TXK3uUlgX2kssAzRugcDN2tgYwR5JRtrdvJcbH5APhLDfSaUy+osvfFplK2rynyZg2Zlq5xvrkw+LzX2PmKhc/zATBLDVRli2/EbVtdNG9sQ10hFYV+pGqey8c8LwCgP1I16XDhCmciBdV0vgDzl+BAqhK1pQhxfBIAOEkKMqmqnGlLs2tdSdaUG/0Z0qH1FVlpDnY0IzJdJkdcRH+xhxu+XxrA/vZyz9OUqonfSTAjRQFo6R53u9aVZFWubywCQET3gOyJGWPFQBSpUWQ7sEQAMU+pEt/RWEx1UUAimPYxQCyYPjClcW/esm1ZleSZhiRy70x5AMdbhrjYlS7PZT4PwBjWTycsIhnLZ3sw23xGcV9QldLF5s1x0aZkzIvyNc+lRCCoasliMdkVELO+OG68y7cnqCuNUZbwcs1bkuKBQSFg/83VBH4xE0EbR5dlnZSswnkHOwcUyqdhRF/aUCYb6wsfGOB8Z5pvW4Zmm02p6seur+edu9d2VgVU+UCgyxrzu+KOnrg0tKuxJm4edElWlRfwRG2CtdUxygt9rvdmgnM3x9421bUlDl6/A5VDB7ofN8Ze3bepgieXJx4IYCGdbh3h59ZRdWKbeH/11dyf1t99A0VHM3n1lvtq65oiEMTg7YDFruLq2hoEiXl5duz7qMATBBQnhdkA77VvMs2df/jNnTsBjLIPoKG84KEMx0KHdTrz+2LXOKqIwZ6HWZvQU1OrytMOfvKbU31OtWrjykKtLvIfqgQfnf5LHap1pYFEVjU1PGUETkZHGk5lAVinHUaELauS+Eaqaot8NjckH7r+TtVNOb16cyDsAJwIp6wffQKiWQDEMh1Mxakt9nl2gZ6/cHLIRI4C32ByoMYDo1MZd0YP178JoHPG7wEcWjtimlNjQxPuvu69YxEnr43otZ5JN2XV84y4DSviZndT2UwDmwHwDaMZm7MfZF1EAp3Dk3bdYuap4ZBj5/ps5HTYKZ8JcsOqPnqha+KtnjEbvLGt2ptdjcICMZqmbEkAkWrb4HjUyCLH80TLsLVW26Mg2MqhZT13//cOdvyWGgq/u947SWNNfCY+ERjjCRVRjnxZRqLSMThuXY5YxkJH90joWZEPZ5sD2NaVPyC47pHsl3ncN4hIzjfB3CdZ51hovcu3J0jEDMnAkAgMyZjBM4Lq9BYS5zLzMjXdCgh9GQ+V9sGQdGgZnXT0pyNUdWlLIHBJFfny/MC8wJgnNh4YBXxnZDfwRVZA6D+GIGfbRjnbNnovp0gE8ueSAOyR+h85kKrCi2qwQYXn2UqgUh0VodPKcFKrVKkUkV/nHidi9Vck7HoVcVPWSTe4XgqCHg6t6Mtl/r/+Ffobb3HYFUVNnF8AAAAASUVORK5CYII=";
  if (data.hasOwnProperty("icon")) icon=data.icon;
  if (data.hasOwnProperty("title")) title=data.title;
  if (data.hasOwnProperty("message")) msg=data.message;

  self.registration.showNotification(title, {
    body: msg,
    icon: icon
  });
});