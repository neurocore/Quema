const ipc = require('electron').ipcRenderer;

ipc.on('get-users-reply', (e, arg) =>
{
    console.log('--- got', arg);
	const put_user = ($el, name) => $el.append(`<div class="item">
                                                    <span>${name}</span>
                                                    <div class="ban"></div>
                                                </div>`);
	$('#queue .queue .group').empty();
	for (const name of arg.party)
		put_user($('#queue .queue .group.party'), name);

    for (const name of arg.queue)
		put_user($('#queue .queue .group.rest'), name);

    $('#stats .stats tbody').empty();
    for (const user of arg.users)
    {
        let $el = $('#stats .stats tbody');
        $el.append(`<tr>
                        <td>${user[0]}</td>
                        <td>${user[1].joined_cnt}</td>
                        <td>${user[1].played_cnt}</td>
                        <td>${user[1].banned_cnt}</td>
                    </tr>`);
    }
});

ipc.send('get-users', 'acquire');

ipc.on('exec-command-reply', (e, arg) =>
{
    if (arg === 'done') ipc.send('get-users', 'update');
});

window.onload = function()
{
	$('.heading .btn').click(function()
	{
		let code = $(this).data('code');
		ipc.send('control-click', code);
	});

    $('input[name="command_line"]').on('keydown', function(e)
    {
        if (e.keyCode !== 13) return;
        const str = $(this).val();
        $(this).val('');
        ipc.send('exec-command', str);
    });
}
