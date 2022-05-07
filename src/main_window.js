const { webFrame } = require('electron')
const ipc = require('electron').ipcRenderer;

ipc.on('get-users-reply', (e, arg) =>
{
    console.log('--- got users reply', arg);
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
        const banned = Math.max(0, user[1].ban_endtime - Date.now());
        const cls = banned > 0 ? 'banned' : '';
        const $el = $('#stats .stats tbody');
        $el.append(`<tr class="${cls}" data-banned="${banned}">
                        <td>${user[0]}</td>
                        <td>${user[1].joined_cnt}</td>
                        <td>${user[1].played_cnt}</td>
                        <td>${user[1].banned_cnt}</td>
                    </tr>`);
    }
});

ipc.on('get-connections', (e, arg) =>
{
    console.log('--- got connections', arg);
    $('#' + arg.type + '_connect').each(function()
    {
        const state = arg.state;
        const arr = {
            'symbol(inactive)'  : ['Соединиться', 'inactive'],
            'symbol(pending)'   : ['Соединение', 'btn-info'],
            'symbol(connected)' : ['Соединение', 'btn-success'],
            'symbol(active)'    : ['Активно', 'btn-success'],
        };

        const row = arr[state];
        if (typeof row !== 'undefined')
        $(this)
            .text(row[0])
            .removeClass().addClass('btn').addClass(row[1]);
    });

    if (typeof arg.avatar !== 'undefined'
    &&  typeof arg.login  !== 'undefined')
    {
        $('.admin_avatar img').attr('src', arg.avatar);
        $('.admin_login').html(arg.login);
        $('.admin_info').addClass('active');
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

    let zoom = 1;
    let zoom_showing_delay = null;
    webFrame.setZoomFactor(zoom);

    function update_zoom()
    {
        webFrame.setZoomFactor(zoom);
        $('.modal.zoom .inner')
            .text(Math.round(zoom * 100) + '%');

        if (zoom_showing_delay !== null)
            clearTimeout(zoom_showing_delay);

        $('.modal.zoom')
            .stop(true)
            .css('visibility', 'visible')
            .css('opacity', '1');

        zoom_showing_delay = setTimeout(function()
        {
            $('.modal.zoom').fadeTo('slow', 0);
        }, 1000);
    }

    $(document).on('mousewheel', function(e)
    {
        if (e.ctrlKey)
        {
            const delta = -e.originalEvent.deltaY / 1000;
            if ((delta > 0 && zoom <  3)
            ||  (delta < 0 && zoom > .2))
                zoom += delta;
            
            zoom = Math.round(zoom * 10) / 10;
            update_zoom();
        }
    });

    $(document).on('keydown', function(e)
    {
        if (e.ctrlKey && e.keyCode == '0'.charCodeAt(0))
        {
            zoom = 1;
            update_zoom();
        }
    });
}
