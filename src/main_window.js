const ipc = require('electron').ipcRenderer;

ipc.on('get-users-reply', (e, arg) =>
{
	const put_user = ($el, name) =>
		$el.append(`<div class="item">
                  <span>${name}</span>
                  <div class="ban"></div>
                </div>`);

	$('#queue .queue .group').empty();
	for (let name of arg.party)
		put_user($('#queue .queue .group.party'), name);

  for (let name of arg.queue)
		put_user($('#queue .queue .group.rest'), name);
});
ipc.send('get-users', 'get');

// $(window).focus(() => console.log("focus"));
// $(window).blur(() => console.log("blur"));

window.onload = function()
{
	$('.heading .btn').click(function()
	{
		let code = $(this).data('code');
		ipc.send('control-click', code);
	});
}