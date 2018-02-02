function analysisTumblrVideoByLink () {
    $ui.loading(true);
    $ui.toast(`解析地址中，请耐心等待`);

    function parseHTML () {
        var data = {
            poster: '',
            title: '',
            url: '',
            type: 'mp4',
            play: false,
            download: [],
        }, i, v;
        var img = document.querySelector('#videoContainer img');
        var atags = document.querySelectorAll('#videoDownload a');
        for (i = 0; i < atags.length; i++ ) {
            var a = atags[i];
            if (/tumblr.*?video_file/.test(a.href)) {
                var url = a.href;
                var str = url.match(/^.*\/(tumblr_.*)$/)[1].split('/');
                var title = str[0]
                var quality = '';

                if (str.length > 1) quality = str[1];
                
                data.download.push({
                    title: title,
                    url: url,
                    type: 'mp4',
                    quality: quality,
                    saveName: title + '.mp4'
                });
            }
        }
        if (img.src != '') data.poster = img.src;
        v = data.download[data.download.length - 1];
        data.url = v.url;
        data.title = v.title;
        $notify('processData', data);
    }

    return new Promise(resolve => {

        rootView.add({
            type: "web",
            props: {
                id: 'tumblr_web',
                url: `https://www.tubeoffline.com/downloadFrom.php?host=tumblr&video=${encodeURI(link)}`,
            },
            layout (make) {
                make.size.equalTo($size(0, 0));
            },
            events: {
                didFinish (sender) {
                    $ui.loading(false);
                    $ui.toast('解析完成');
                    $console.info(convertFunc(parseHTML))
                    sender.eval({ script: convertFunc(parseHTML) });
                },
                processData (data) {
                    $console.info('processData');
                    $console.info(data);
                    resolve(data);
                    $device.taptic(0);
                    // $('tumblr_web').remove();
                }
            }
        });
    });
}