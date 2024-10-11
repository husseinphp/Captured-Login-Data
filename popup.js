document.addEventListener('DOMContentLoaded', function() {
    let textarea = document.getElementById('loginData');

    chrome.storage.local.get({ logins: [] }, function(result) {
        let logins = result.logins;
        logins.forEach(login => {
            textarea.value += `URL: ${login.url}\nParameters:\n`;

            let sqlmapParams = "";

            if (login.params.uname) {
                sqlmapParams += `username=${encodeURIComponent(login.params.uname)}&`;
            }

            if (login.params.pass) {
                sqlmapParams += `password=${encodeURIComponent(login.params.pass)}&`;
            }

            for (let key in login.params) {
                if (key !== 'uname' && key !== 'pass') {
                    sqlmapParams += `${key}=${encodeURIComponent(login.params[key])}&`;
                }
            }

            sqlmapParams = sqlmapParams.slice(0, -1);

            const sqlmapCommand = `sqlmap -u "${login.url}" --random-agent --batch --threads=10 --level=5 --risk=3 --data "${sqlmapParams.replace(/&/g, "&")}"`;
            textarea.value += `SQLMAP Command: ${sqlmapCommand}\n`;
            textarea.value += `\n--------------------------\n`;
        });
    });

    document.getElementById('clearButton').addEventListener('click', function() {
        textarea.value = '';

        chrome.storage.local.set({ logins: [] }, function() {
            console.log("Data cleared from storage.");  // رسالة تأكيد في وحدة التحكم
        });
    });

   
});
