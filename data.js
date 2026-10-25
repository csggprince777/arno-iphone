/* ============================================================
   ArnoiPhone 内容数据
   ------------------------------------------------------------
   wallpaper / 相册照片：等 Arno 确认后填入，不在此处擅自使用照片
   wallpaper.lock = 锁屏壁纸路径，wallpaper.home = 主屏壁纸路径
   例如：wallpaper: { lock: 'photos/lock.jpg', home: 'photos/home.jpg' }
   ============================================================ */
const DATA = {
  owner: 'Arno',
  ownerAv: 'photos/av1.jpg',

  wallpaper: {
    lock: 'photos/lock.jpg',
    home: ''
  },

  /* 交互剧本：按顺序播放；me = true 表示轮到 Arno 发言（输入框闪蓝 → 点击自动键入 → 发送）
     xpost = 更新一条 X 日记；igshow/igpop = 信息流保留哪几条帖子 / 弹窗提示第几条
     剧本按「步」分段：第一步 = alpha开发部群聊 → Leo社长 → IG 第 5 条 */
  play: [
    /* —— alpha开发部 群聊（先播） —— */
    { src: 'kakao', name: 'alpha开发部', me: false, from: 'Leo社长', text: '先祝贺我们又迎来新鲜血液🎉', time: '09:01' },
    /* 弹窗出现后停在锁屏，等 Arno 解锁并进入群聊再继续 */
    { gate: 'open', src: 'kakao', name: 'alpha开发部' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '贺鑫隆', text: '欢迎상현!!!', time: '09:02' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '김건우', text: '新鲜奴役吧', time: '09:02' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '준서', text: '欢迎상현!', time: '09:02' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '周安信', text: '这下实习生可惨了…', time: '09:03' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '상현', text: '大家好！我是新来的实习生상현！我会努力跟上前辈们的...', time: '09:03' },
    { src: 'kakao', name: 'alpha开发部', me: true, text: '他们只是在开玩笑', time: '09:04' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '이상원', text: '好歹也恭喜一下我和安信转正吧', time: '09:04' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: 'Leo社长', text: '那行，恭喜恭喜！', time: '15:05' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: 'Leo社长', text: '今晚聚餐，全场消费', time: '15:05' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '周安信', text: '由A部长买单！', time: '15:05' },
    { src: 'kakao', name: 'alpha开发部', me: true, text: '👎', time: '15:06' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '준서', text: '好了好了，公司聚餐经费还够着呢 🙏', time: '15:06' },
    { src: 'kakao', name: 'alpha开发部', me: true, img: 'photos/chat-mt.jpg', time: '15:41' },
    { src: 'kakao', name: 'alpha开发部', me: true, text: '首次团建照', time: '15:41' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '周安信', text: '有点子土😮', time: '15:42' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '상현', text: '😮', time: '15:42' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '김건우', text: '😮', time: '15:42' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '贺鑫隆', text: '😭', time: '15:42' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: 'Leo社长', text: '😭😭😭', time: '15:42' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: 'Leo社长', text: '妈的，挑什么', time: '15:42' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: 'Leo社长', text: '这个就当成企业照了', time: '15:43' },
    { src: 'kakao', name: 'alpha开发部', me: true, text: '?', time: '15:43' },
    { src: 'kakao', name: 'alpha开发部', me: true, text: '我看我们还是用这张吧', time: '15:43' },
    { src: 'kakao', name: 'alpha开发部', me: true, img: 'photos/chat-photo.jpg', time: '15:43' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '이상원', text: '部长够大胆', time: '15:43' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: 'Leo社长', text: '...行，就按A部长说的做', time: '15:44' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '상현', text: '？天黑了', time: '15:44' },
    { src: 'kakao', name: 'alpha开发部', me: false, from: '周安信', text: '？天黑了', time: '15:44' },
    { src: 'kakao', name: 'alpha开发部', me: true, text: '收到', time: '15:44' },
    /* 群聊结束：返回键闪烁，等 Arno 返回列表 */
    { src: 'kakao', name: 'alpha开发部', gate: 'back' },

    /* —— Leo社长 私聊（后播） —— */
    { src: 'kakao', name: 'Leo社长', me: false, text: '今天辛苦了。', time: '20:45' },
    { src: 'kakao', name: 'Leo社长', me: true, img: 'photos/st10.jpg', time: '20:45' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '拍的还满意吗，我们社长', time: '20:45' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '可以', time: '20:45' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '涨工资', time: '20:45' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '有钱给我涨工资，却没钱开两间房呢', time: '20:45' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '😆', time: '20:46' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '哦哦是吗', time: '20:46' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '这里房间确实紧张', time: '20:46' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '你知道的，况且现在还是周末', time: '20:46' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '我当然知道呀，只是委屈社长了', time: '20:47' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '周末加班工资三倍。', time: '20:47' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '行。', time: '20:47' },

    /* —— 第一步结束：弹出第 5 条 ins 帖子 —— */
    { igshow: [5], igpop: 5 },

    /* ============================================================
       第二步
       1. p1–p3 与 상현 的 KKT
       ============================================================ */
    { src: 'kakao', name: '상현', me: false, text: '部长好!', time: '00:59' },
    { src: 'kakao', name: '상현', me: false, text: '社长说是您带我，希望您多多包容!', time: '00:59' },
    { src: 'kakao', name: '상현', me: false, text: '🥺🥺🥺', time: '00:59' },
    { src: 'kakao', name: '상현', me: true, text: '你好상현😊', time: '00:59' },

    { src: 'kakao', name: '상현', me: false, text: '部长，我要喝草莓拿铁', time: '01:59' },
    { src: 'kakao', name: '상현', me: true, text: '没有', time: '01:59' },
    { src: 'kakao', name: '상현', me: true, text: '自己下楼买', time: '02:00' },
    { src: 'kakao', name: '상현', me: false, text: '☹️', time: '02:00' },
    { src: 'kakao', name: '상현', me: false, text: '那我去买了再回来', time: '02:00' },
    { src: 'kakao', name: '상현', me: true, text: '算旷工', time: '02:00' },
    { src: 'kakao', name: '상현', me: false, text: '？？！', time: '02:00' },
    { src: 'kakao', name: '상현', me: false, text: '不能这样哇😭', time: '02:00' },
    { src: 'kakao', name: '상현', me: true, text: '你去把社长桌面的资料给我拿过来', time: '02:01' },
    { src: 'kakao', name: '상현', me: false, text: '好的', time: '02:01' },
    { src: 'kakao', name: '상현', me: true, text: '过来帮我拉个表格', time: '02:02' },
    { src: 'kakao', name: '상현', me: false, text: '好', time: '02:02' },
    { src: 'kakao', name: '상현', me: true, text: '帮我倒杯温水', time: '02:02' },
    { src: 'kakao', name: '상현', me: false, text: '部长您怎么了', time: '02:02' },
    { src: 'kakao', name: '상현', me: false, text: '喉咙难受吗', time: '02:02' },
    { src: 'kakao', name: '상현', me: false, text: '我有药', time: '02:02' },
    { src: 'kakao', name: '상현', me: true, text: '没事，就是突然想喝而已', time: '02:03' },
    { src: 'kakao', name: '상현', me: false, text: '你嗓子都哑了！', time: '02:03' },
    { src: 'kakao', name: '상현', me: false, text: '我给你泡蜂蜜水', time: '02:03' },
    { src: 'kakao', name: '상현', me: true, text: '...谢谢', time: '02:03' },
    { src: 'kakao', name: '상현', me: true, text: '我工作忙，你先跟着安信干', time: '02:04' },
    { src: 'kakao', name: '상현', me: false, text: '部长你这么快就嫌我烦了吗', time: '02:09' },
    { src: 'kakao', name: '상현', me: false, text: '是我蜂蜜倒太多太甜了吗🥺', time: '02:09' },
    { src: 'kakao', name: '상현', me: true, text: '没有的事', time: '02:09' },
    { src: 'kakao', name: '상현', me: true, text: '我喜欢甜的', time: '02:09' },
    { src: 'kakao', name: '상현', me: false, text: '🥺', time: '02:10' },
    { src: 'kakao', name: '상현', me: false, text: '那就好！', time: '02:10' },
    { src: 'kakao', name: '상현', me: true, text: '你别想太多，安信和你差不多大，你们相处起来应该挺合适', time: '02:12' },
    { src: 'kakao', name: '상현', me: true, text: '有什么问题就来问我', time: '15:21' },
    { src: 'kakao', name: '상현', me: false, text: '✌️', time: '15:22' },

    /* ============================================================
       2. p4 与 周安信 的微信
       ============================================================ */
    { src: 'wechat', name: '周安信', me: false, text: '你他妈有几个宝宝', time: '02:04' },
    { src: 'wechat', name: '周安信', me: true, text: '我从没叫过别人宝宝，安信', time: '02:04' },
    { src: 'wechat', name: '周安信', me: false, text: '哦哦', time: '02:04' },
    { src: 'wechat', name: '周安信', me: false, text: '我就问一下', time: '02:04' },
    { src: 'wechat', name: '周安信', me: false, text: '你那个实习生到底会不会做事，把蜂蜜弄我桌面上了', time: '02:06' },
    { src: 'wechat', name: '周安信', me: true, text: '你也吃点', time: '02:06' },
    { src: 'wechat', name: '周安信', me: true, text: '吃甜的心情好', time: '02:06' },
    { src: 'wechat', name: '周安信', me: false, text: '😾', time: '02:06' },
    { src: 'wechat', name: '周安信', me: false, text: '好了我原谅他了，他来道歉了', time: '02:07' },
    { src: 'wechat', name: '周安信', me: true, text: '行，正好，你让他跟着你点，我忙着呢，跟社长说过了', time: '02:08' },
    { src: 'wechat', name: '周安信', me: false, text: '什么？', time: '02:08' },
    { src: 'wechat', name: '周安信', me: false, text: '什么？！', time: '02:08' },

    /* ============================================================
       3. p5 与 이상원 的 KKT
       ============================================================ */
    { src: 'kakao', name: '이상원', me: false, img: 'photos/chat-selfie.jpg', time: '00:34' },
    { src: 'kakao', name: '이상원', me: true, text: '🤭', time: '00:35' },
    { src: 'kakao', name: '이상원', me: true, text: '今天加班累，不开房', time: '00:35' },
    { src: 'kakao', name: '이상원', me: false, text: '部长不那么恪尽职守，工资也不会少的', time: '00:35' },
    { src: 'kakao', name: '이상원', me: true, text: '...', time: '00:35' },
    { src: 'kakao', name: '이상원', me: false, text: '...求你了', time: '00:36' },
    { src: 'kakao', name: '이상원', me: true, text: '...来我家吧', time: '00:36' },
    { src: 'kakao', name: '이상원', me: true, text: '自己过来', time: '00:36' },

    /* ============================================================
       4. 显示第 1 条 ins 帖子（在上方），此时只保留第 1、5 条
       ============================================================ */
    { igshow: [1, 5], igpop: 1 },

    /* ============================================================
       5. p6–p7 与 이상원 的 KKT
       ============================================================ */
    { src: 'kakao', name: '이상원', me: true, text: '我感觉我少了点东西呢', time: '00:37' },
    { src: 'kakao', name: '이상원', me: true, text: '是不是啊', time: '00:37' },
    { src: 'kakao', name: '이상원', me: false, img: 'photos/chat-polaroid.jpg', time: '00:37' },
    { src: 'kakao', name: '이상원', me: false, text: '我就收下了', time: '00:37' },
    { src: 'kakao', name: '이상원', me: false, text: '会好好保管的', time: '00:37' },
    { src: 'kakao', name: '이상원', me: true, text: '希望不是塞在钱包里', time: '00:38' },
    { src: 'kakao', name: '이상원', me: false, text: '你在怕什么', time: '00:38' },
    { src: 'kakao', name: '이상원', me: true, text: '🤭', time: '00:38' },
    { src: 'kakao', name: '이상원', me: true, img: 'photos/chat-dinner.jpg', time: '00:40' },
    { src: 'kakao', name: '이상원', me: false, text: '😠', time: '00:40' },

    /* ============================================================
       6. p8 与 상현 的 KKT
       ============================================================ */
    { src: 'kakao', name: '상현', me: true, img: 'photos/chat-tee.jpg', time: '15:23' },
    { src: 'kakao', name: '상현', me: true, text: '可爱', time: '15:23' },
    { src: 'kakao', name: '상현', me: false, text: '竟然偷偷拍我', time: '15:24' },
    { src: 'kakao', name: '상현', me: true, text: '怎么了，多可爱呀不是吗', time: '15:24' },
    { src: 'kakao', name: '상현', me: false, text: '如果部长觉得可爱的话，我还可以一直装可爱', time: '15:24' },
    { src: 'kakao', name: '상현', me: true, text: '什么嘛，我看你ig发的那些快拍是几个意思啊，完全不是你', time: '15:24' },
    { src: 'kakao', name: '상현', me: true, text: '没有在装可爱吧', time: '15:24' },
    { src: 'kakao', name: '상현', me: true, text: '是真可爱', time: '15:24' },
    { src: 'kakao', name: '상현', me: false, text: '🙂🙂🙂아니...', time: '15:25' },

    /* ============================================================
       7. 更新 X 日记（第二步结束）
       ============================================================ */
    { xpost: { date: '10月24日 · 23:58', text: '今天来了个实习生，有点烦人，真是棘手呢。\n还有点可爱。' } },

    /* ============================================================
       第三步
       1. 弹出第 4 条 ins 帖子（在上方）
       ============================================================ */
    { igshow: [1, 4, 5], igpop: 4 },

    /* ============================================================
       2. p1–p2 与 Leo社长 的 KKT
       ============================================================ */
    { src: 'kakao', name: 'Leo社长', me: false, text: '你说要给我的画', time: '00:47' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '什么时候才打算动笔', time: '00:47' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '哎呀', time: '00:48' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '你看我都给忙忘了', time: '00:48' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '这取决于社长您想要展示在哪里了', time: '00:48' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '你怎么这么有信心我会展示', time: '00:49' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '哦？不是你说的吗', time: '00:49' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '又不是我主动要给的', time: '00:49' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '……', time: '00:49' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '展示在我的房间里，偷偷的', time: '00:49' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '明天有一个紧急会议，跟我去隔壁市开会', time: '03:47' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '好的', time: '03:47' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '那个房间...', time: '03:47' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '我会让俊代理订一间的', time: '03:48' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '...双床房', time: '03:48' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '好', time: '03:48' },

    /* ============================================================
       3. p3 与 이상원 的 KKT
       ============================================================ */
    { src: 'kakao', name: '이상원', me: false, text: '明天', time: '03:48' },
    { src: 'kakao', name: '이상원', me: true, text: '不行哦', time: '03:49' },
    { src: 'kakao', name: '이상원', me: true, text: '明天又出差', time: '03:49' },
    { src: 'kakao', name: '이상원', me: false, text: '又？', time: '03:49' },
    { src: 'kakao', name: '이상원', me: false, text: '怎么天天加班，明天可是周末', time: '03:49' },
    { src: 'kakao', name: '이상원', me: true, text: '没办法啦', time: '03:49' },
    { src: 'kakao', name: '이상원', me: true, text: '回来带你去吃饭', time: '03:49' },
    { src: 'kakao', name: '이상원', me: true, text: '请你～', time: '03:49' },
    { src: 'kakao', name: '이상원', me: false, text: '🤒', time: '03:49' },
    { src: 'kakao', name: '이상원', me: false, text: '请吃饭的漂亮部长啊，请把开房钱一起付了吧', time: '03:50' },
    { src: 'kakao', name: '이상원', me: true, text: '我就知道', time: '03:51' },
    { src: 'kakao', name: '이상원', me: false, text: '那我能再去一次你家吗', time: '03:52' },
    { src: 'kakao', name: '이상원', me: true, text: '😐', time: '03:52' },
    { src: 'kakao', name: '이상원', me: false, text: '🥺', time: '03:52' },

    /* ============================================================
       4. 弹出第 7 条 ins 帖子
       ============================================================ */
    { igshow: [1, 4, 5, 7], igpop: 7 },

    /* ============================================================
       5. p4 与 周安信 的微信
       ============================================================ */
    { src: 'wechat', name: '周安信', me: false, text: '我到家了，豪哥。', time: '15:44' },
    { src: 'wechat', name: '周安信', me: true, text: '和상현一起出去了？', time: '15:45' },
    { src: 'wechat', name: '周安信', me: false, text: '对呀', time: '15:45' },
    { src: 'wechat', name: '周安信', me: false, text: '难得周末，你还不在家', time: '15:45' },
    { src: 'wechat', name: '周安信', me: true, text: '我出差呢', time: '15:45' },
    { src: 'wechat', name: '周安信', me: true, text: '别闹脾气呀', time: '15:45' },
    { src: 'wechat', name: '周安信', me: true, text: '下周我带你去游乐园好不', time: '15:45' },
    { src: 'wechat', name: '周安信', me: false, text: '我没有闹脾气啊，小猪比你可爱多了', time: '15:46' },
    { src: 'wechat', name: '周安信', me: false, text: '不过既然你都这么说了', time: '15:46' },
    { src: 'wechat', name: '周安信', me: false, text: '那我肯定是要答应的', time: '15:46' },
    { src: 'wechat', name: '周安信', me: true, text: '那就好', time: '15:47' },

    /* ============================================================
       6. X 日记自下而上更新两条（第三步结束）
       ============================================================ */
    { xpost: { date: '10月25日 · 04:12', text: '实习生意外地在我面前内向，却和安信玩的好呢\n莫名有点不愉悦，呵' } },
    { xpost: { date: '10月25日 · 16:03', text: '每次出差都累死了，虽然周末加班已经是常态，但leo哥想跟我deeptalk的时候我不想听也没办法拒绝。\n上次준代理问我如此讨好社长，工资涨了多少，我心想，反了吧这是' } },

    /* ============================================================
       第四步
       1. 弹出第 3 条 ins
       ============================================================ */
    { igshow: [1, 3, 4, 5, 7], igpop: 3 },

    /* ============================================================
       2. p1 与 周安信 的微信
       ============================================================ */
    { src: 'wechat', name: '周安信', me: false, text: '豪哥', time: '03:43' },
    { src: 'wechat', name: '周安信', me: false, text: '还想再去游乐园', time: '03:43' },
    { src: 'wechat', name: '周安信', me: true, text: '以后都能去', time: '03:44' },
    { src: 'wechat', name: '周安信', me: true, text: '多大了都能去', time: '03:44' },
    { src: 'wechat', name: '周安信', me: false, text: '那我要把你绑在旋转木马上', time: '03:44' },
    { src: 'wechat', name: '周安信', me: true, text: '对不起啊，比在鬼屋里接吻更可怕', time: '03:44' },
    { src: 'wechat', name: '周安信', me: false, text: '豪哥！', time: '03:44' },
    { src: 'wechat', name: '周安信', me: false, text: '我们把人家NPC都吓到了 🙁', time: '03:44' },
    { src: 'wechat', name: '周安信', me: true, text: '我才被你吓到了，你力气大到把我的手攥白了', time: '03:46' },

    /* ============================================================
       3. 弹出第 6 条 ins
       ============================================================ */
    { igshow: [1, 3, 4, 5, 6, 7], igpop: 6 },

    /* ============================================================
       4. p2–p4 与 상현 的 KKT（第四步结束）
       ============================================================ */
    { src: 'kakao', name: '상현', me: false, img: 'photos/chat-sanghyun.jpg', time: '15:57' },
    { src: 'kakao', name: '상현', me: false, text: '哥哥！晚安！', time: '15:57' },
    { src: 'kakao', name: '상현', me: true, text: '嘴怎么撅着', time: '15:57' },
    { src: 'kakao', name: '상현', me: true, text: '逃加班被扣工资了吧', time: '15:57' },
    { src: 'kakao', name: '상현', me: true, img: 'photos/chat-mirror.jpg', time: '15:59' },
    { src: 'kakao', name: '상현', me: true, text: '刚回到家', time: '15:59' },
    { src: 'kakao', name: '상현', me: false, text: '哇...部长这种照片，可千万不要发到ig上啊', time: '15:59' },
    { src: 'kakao', name: '상현', me: true, text: 'ㅋㅋ为什么呀', time: '15:59' },
    { src: 'kakao', name: '상현', me: false, text: '不想别人看到这样的你', time: '16:00' },
    { src: 'kakao', name: '상현', me: true, text: '这就不能看了？', time: '16:00' },
    { src: 'kakao', name: '상현', me: true, img: 'photos/chat-tank.jpg', time: '16:00' },
    { src: 'kakao', name: '상현', me: false, text: '아니야 😖不要发这种啦！', time: '16:00' },
    { src: 'kakao', name: '상현', me: true, text: '可爱', time: '16:00' },

    /* ============================================================
       第五步
       1. p1–p2 与 周安信 的微信
       ============================================================ */
    { src: 'wechat', name: '周安信', me: false, text: '你又偷拍我了是不', time: '17:41' },
    { src: 'wechat', name: '周安信', me: false, text: '你又偷偷留我丑照', time: '17:41' },
    { src: 'wechat', name: '周安信', me: true, text: '很帅啊！', time: '17:41' },
    { src: 'wechat', name: '周安信', me: true, img: 'photos/chat-suit.jpg', time: '17:41' },
    { src: 'wechat', name: '周安信', me: true, text: '像高中生来上班了哈哈哈', time: '17:41' },
    { src: 'wechat', name: '周安信', me: false, text: '校草级别这是', time: '17:42' },
    { src: 'wechat', name: '周安信', me: false, text: '不是，谁让你早上扔给我这件高中的西服外套', time: '17:42' },
    { src: 'wechat', name: '周安信', me: false, text: '我想把这个铭牌剪掉都不行 😭', time: '17:42' },
    { src: 'wechat', name: '周安信', me: true, text: '我就是想了，那个脸颊肉嘟嘟，有深深酒窝的安信', time: '17:44' },
    { src: 'wechat', name: '周安信', me: false, text: '那现在的我你是不喜欢吗', time: '17:44' },
    /* p2 */
    { src: 'wechat', name: '周安信', me: true, text: '又在胡思乱想什么', time: '17:44' },
    { src: 'wechat', name: '周安信', me: true, text: '对了...', time: '17:44' },
    { src: 'wechat', name: '周安信', me: true, text: '你可小心点，别让其他人知道我们住在一起了', time: '17:44' },
    { src: 'wechat', name: '周安信', me: false, text: '呵呵，我天天坐地铁回家，谁能知道我回的哪里', time: '17:44' },
    { src: 'wechat', name: '周安信', me: true, text: '抱歉啦，谁让我要加班呢', time: '17:45' },

    /* ============================================================
       2. p3–p4 与 상현 的 KKT
       ============================================================ */
    { src: 'kakao', name: '상현', me: false, text: '谢谢部长今天送我回家！', time: '17:45' },
    { src: 'kakao', name: '상현', me: false, text: '有了车窗就不会感冒了耶 🤒', time: '17:45' },
    { src: 'kakao', name: '상현', me: true, text: 'hh到家了就好', time: '17:46' },
    { src: 'kakao', name: '상현', me: false, text: '哥哥今天怎么不给我发之前那种照片了 🥺', time: '17:46' },
    { src: 'kakao', name: '상현', me: true, text: '有点贪心了吧', time: '17:46' },
    { src: 'kakao', name: '상현', me: true, img: 'photos/chat-dark.jpg', time: '17:46' },
    { src: 'kakao', name: '상현', me: false, text: 'aaa，还是不要发了', time: '17:47' },
    { src: 'kakao', name: '상현', me: false, text: '😭', time: '17:47' },
    { src: 'kakao', name: '상현', me: false, text: '感觉在被蛇盯着呢', time: '17:47' },
    { src: 'kakao', name: '상현', me: true, text: '要被吃掉了吧', time: '17:47' },
    /* p4 */
    { src: 'kakao', name: '상현', me: false, text: '...', time: '17:48' },
    { src: 'kakao', name: '상현', me: false, text: '明天去机场你会来接我吗', time: '17:48' },
    { src: 'kakao', name: '상현', me: true, text: '当然啦', time: '17:48' },
    { src: 'kakao', name: '상현', me: true, text: '等着吧', time: '17:48' },
    { src: 'kakao', name: '상현', me: false, text: '😍', time: '17:48' },

    /* ============================================================
       第六步
       1. 弹出第 2 条 ins（时间已改为今天）
       ============================================================ */
    { igshow: [2, 1, 3, 4, 5, 6, 7], igpop: 2 },

    /* ============================================================
       2. p1 与 상현 的 KKT
       ============================================================ */
    { src: 'kakao', name: '상현', me: false, img: 'photos/chat-sang2.jpg', time: '18:26' },
    { src: 'kakao', name: '상현', me: false, text: '嘴巴都红红的了！', time: '18:26' },
    { src: 'kakao', name: '상현', me: true, text: '害羞了吗', time: '18:27' },
    { src: 'kakao', name: '상현', me: true, text: '还是哥哥做错了', time: '18:27' },
    { src: 'kakao', name: '상현', me: false, text: '部长nim...', time: '18:27' },
    { src: 'kakao', name: '상현', me: true, text: '又叫部长了，这么生疏', time: '18:27' },
    { src: 'kakao', name: '상현', me: false, text: '啊啊啊不是的😭', time: '18:27' },
    { src: 'kakao', name: '상현', me: true, text: '所以不喜欢吗', time: '18:27' },
    { src: 'kakao', name: '상현', me: false, text: '喜欢...', time: '18:27' },
    { src: 'kakao', name: '상현', me: false, text: '很喜欢...', time: '18:27' },

    /* ============================================================
       3. p2–p3 与 이상원 的 KKT
       ============================================================ */
    { src: 'kakao', name: '이상원', me: false, text: '我落地了', time: '17:49' },
    { src: 'kakao', name: '이상원', me: true, text: '出差顺利吗', time: '17:49' },
    { src: 'kakao', name: '이상원', me: false, text: '我们公司除了出差就没别的事干了吗', time: '17:49' },
    { src: 'kakao', name: '이상원', me: false, text: '空壳公司', time: '17:49' },
    { src: 'kakao', name: '이상원', me: false, img: 'photos/chat-car.jpg', time: '17:49' },
    { src: 'kakao', name: '이상원', me: false, text: '我被流放了', time: '17:49' },
    { src: 'kakao', name: '이상원', me: true, text: '摆出这种表情给谁看呢', time: '17:50' },
    { src: 'kakao', name: '이상원', me: true, text: '你旁边就是俊代理别以为我不知道啊', time: '17:50' },
    { src: 'kakao', name: '이상원', me: false, text: '可我只想和你...', time: '17:50' },
    { src: 'kakao', name: '이상원', me: false, text: '今天晚上', time: '17:50' },
    { src: 'kakao', name: '이상원', me: false, text: 'xx酒店1105', time: '17:50' },
    { src: 'kakao', name: '이상원', me: true, text: '能不去吗，我今晚有点走不开', time: '17:51' },
    /* p3 */
    { src: 'kakao', name: '이상원', me: false, text: '推了', time: '17:51' },
    { src: 'kakao', name: '이상원', me: true, text: '...行', time: '17:51' },

    /* ============================================================
       4. p4 与 周安信 的微信
       ============================================================ */
    { src: 'wechat', name: '周安信', me: false, text: '哥哥今天不是出差结束了吗，怎么还不回来', time: '18:25' },
    { src: 'wechat', name: '周安信', me: true, text: '今天还在忙呢，抱歉了', time: '18:25' },
    { src: 'wechat', name: '周安信', me: false, text: '讨厌你', time: '18:25' },
    { src: 'wechat', name: '周安信', me: true, text: '不要讨厌我', time: '18:25' },

    /* ============================================================
       5. p5–p6 与 Leo社长 的 KKT
       ============================================================ */
    { src: 'kakao', name: 'Leo社长', me: false, text: '今天这么早就结束工作走了？', time: '17:52' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '我本来就没有加班的义务吧，社长', time: '17:52' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '之前这么努力都是为了你呀', time: '17:53' },
    { src: 'kakao', name: 'Leo社长', me: true, img: 'photos/chat-bandana.jpg', time: '17:53' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '要不我把这个发出去', time: '17:54' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '你知道我不怕这种的...', time: '17:55' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '诶，又不是威胁', time: '17:55' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '逗逗你而已', time: '17:55' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '知道了', time: '17:55' },
    /* p6 */
    { src: 'kakao', name: 'Leo社长', me: false, text: '你要跳槽了？', time: '18:15' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '你听谁说的', time: '18:15' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '没人说。', time: '18:15' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '离不开我了', time: '18:16' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '嗯', time: '18:16' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '和我待在一起很舒服', time: '18:16' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '嗯', time: '18:16' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '承认得这么干脆', time: '18:16' },
    { src: 'kakao', name: 'Leo社长', me: false, text: '嗯', time: '18:16' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '我不会走的', time: '18:16' },
    { src: 'kakao', name: 'Leo社长', me: true, text: '我一直，在这里', time: '18:16' },

    /* ============================================================
       6. 主页条闪烁；回到桌面后提醒事项最上方加入一条
       ============================================================ */
    { gate: 'home', reminder: 'xx酒店1105' },

    /* ============================================================
       7. X 日记自下而上更新两条
       ============================================================ */
    { xpost: { date: '10月25日 · 18:30', text: '一不小心碰到了상현的嘴唇呀...这家伙好像比起接吻更贪恋我的怀抱。\n\n但他没承认，好吧，他说喜欢的是我搭在他头上随意抚摸的手' } },
    { xpost: { date: '10月25日 · 18:45', text: 'leo又这样了，为什么这么没安全感呢，我说的话不可信吗' } }
  ],

  /* 微信好友（预设记录：周安信=近期，陈炳帆=半年前） */
  wechat: [
    {
      name: '周安信',
      color: '#4a90e2',
      img: 'photos/av6.jpg',
      time: '10:32',
      preview: '你放心吧，没人抢你的牛马工位',
      unread: 0,
      reply: '',
      msgs: [
        { me: false, text: '豪哥豪哥', time: '10:31' },
        { me: false, text: '我们部门要来一个实习生是不是啊', time: '10:31' },
        { me: true, text: '对呀，你咋又知道了', time: '10:31' },
        { me: false, text: '有人泄露机密了', time: '10:31' },
        { me: false, text: '说他是你直系学弟来着', time: '10:31' },
        { me: true, text: '哦？我还真没注意', time: '10:31' },
        { me: true, text: '还没来得及看他的简历', time: '10:32' },
        { me: false, text: '总感觉很不安', time: '10:32' },
        { me: true, text: '你放心吧，没人抢你的牛马工位', time: '10:32' }
      ]
    },
    { name: '陈凯文', color: '#e8875b', time: '', preview: '暂无消息', unread: 0, reply: '', msgs: [] },
    {
      name: '陈炳帆',
      color: '#5b8def',
      time: '半年前',
      preview: '🫂',
      unread: 0,
      reply: '',
      msgs: [
        { me: false, text: '哥哥，我也不想调走', time: '10:14 半年前' },
        { me: true, text: '没事的，虽然是分部，但职级更高了', time: '10:14 半年前' },
        { me: true, text: '这完全是你能力的展现啊', time: '10:14 半年前' },
        { me: false, text: '你知道我担心的不是这个', time: '10:15 半年前' },
        { me: false, text: '哥哥', time: '10:15 半年前' },
        { me: false, text: '我们见面的时间肯定越来越少了', time: '10:15 半年前' },
        { me: false, text: '😭', time: '10:15 半年前' },
        { me: true, text: '🫂', time: '10:15 半年前' }
      ]
    },
    { name: '林韩中', color: '#34c759', time: '', preview: '暂无消息', unread: 0, reply: '', msgs: [] },
    { name: '李梓豪', color: '#f2c14e', time: '', preview: '暂无消息', unread: 0, reply: '', msgs: [] },
    { name: '薛苏仁', color: '#8e7cc3', time: '', preview: '暂无消息', unread: 0, reply: '', msgs: [] }
  ],

  /* KakaoTalk：好友 + alpha开发部群聊（预设记录：群聊 / 이상원） */
  kakao: [
    {
      name: 'alpha开发部',
      group: true,
      av: 'α',
      color: '#3c4149',
      members: ['Arno', '周安信', '贺鑫隆', 'Leo社长', '상현', '이상원', '김준서', '김건우'],
      time: '',
      preview: '暂无消息',
      unread: 0,
      reply: '',
      /* 预设记录已全部改为交互剧本（见 DATA.play），打开时从空白开始播放 */
      msgs: []
    },
    {
      name: '이상원',
      color: '#b06ab3',
      img: 'photos/av8.jpg',
      time: '',
      preview: '暂无消息',
      unread: 0,
      reply: '',
      /* 预设记录已改为交互剧本（见 DATA.play 第二步），打开时从空白开始 */
      msgs: []
    },
    { name: '周安信', color: '#4a90e2', img: 'photos/av6.jpg', time: '', preview: '暂无消息', unread: 0, reply: '', msgs: [] },
    { name: '贺鑫隆', color: '#ff8a5b', img: 'photos/av4.jpg', time: '', preview: '暂无消息', unread: 0, reply: '', msgs: [] },
    { name: 'Leo社长', color: '#3c4149', img: 'photos/av3.jpg', time: '', preview: '暂无消息', unread: 0, reply: '', msgs: [] },
    { name: '상현', color: '#7a9e9f', img: 'photos/av5.jpg', time: '', preview: '暂无消息', unread: 0, reply: '', msgs: [] },
    { name: '김준서', color: '#f2c14e', img: 'photos/av2.jpg', time: '', preview: '暂无消息', unread: 0, reply: '', msgs: [] },
    { name: '김건우', color: '#5aa9e6', img: 'photos/av7.jpg', time: '', preview: '暂无消息', unread: 0, reply: '', msgs: [] }
  ],

  /* 短信 */
  sms: [
    {
      name: '周安信',
      color: '#9aa0a6',
      img: 'photos/av6.jpg',
      time: '09:30',
      preview: '到楼下了',
      unread: 1,
      reply: '马上下来。',
      msgs: [
        { me: false, text: '到楼下了', time: '09:30' }
      ]
    },
    {
      name: '快递',
      color: '#9aa0a6',
      time: '昨天',
      preview: '您的包裹已放至前台',
      unread: 0,
      reply: '',
      msgs: [
        { me: false, text: '您的包裹已放至前台，请及时领取。', time: '16:20' }
      ]
    }
  ],

  /* 电话 · 最近通话 */
  recents: [
    { name: '周安信', type: '拨出', time: '今天 09:21', color: '#4a90e2', img: 'photos/av6.jpg' },
    { name: '김준서', type: '来电', time: '昨天 21:08', color: '#f2c14e', img: 'photos/av2.jpg' },
    { name: '陈凯文', type: '拨出', time: '昨天 18:42', color: '#e8875b' },
    { name: '贺鑫隆', type: '未接', time: '10月22日', color: '#ff8a5b', img: 'photos/av4.jpg' }
  ],

  /* Instagram */
  instagram: {
    /* 快拍：互关好友，frames.img 为照片 */
    stories: [
      { name: '신神',          color: '#4a90e2', img: 'photos/av6.jpg', frames: [{ img: 'photos/st2.jpg' }] },
      { name: '상현',           color: '#7a9e9f', img: 'photos/av5.jpg', frames: [{ img: 'photos/st9.jpg' }] },
      { name: 'jadedstill',     color: '#e8875b', img: 'photos/av3.jpg', frames: [{ img: 'photos/st7.jpg' }] },
      { name: 'leeeeesangwon', color: '#b06ab3', img: 'photos/av8.jpg', frames: [{ img: 'photos/st3.jpg' }, { img: 'photos/st4.jpg' }] },
      { name: 'LONG',          color: '#34c759', img: 'photos/av4.jpg', frames: [{ img: 'photos/st5.jpg' }] },
      { name: '준서',           color: '#f2c14e', img: 'photos/av2.jpg', frames: [{ img: 'photos/st6.jpg' }] },
      { name: '건우',           color: '#5aa9e6', img: 'photos/av7.jpg', frames: [{ img: 'photos/st1.jpg' }] },
      { name: 'Arno',          color: '#4a90e2', img: 'photos/av1.jpg', frames: [{ img: 'photos/st8.jpg' }] }
    ],
    /* no = 帖子编号（剧本里「第 N 条」即 no）；数组顺序 = 信息流从上到下的显示顺序 */
    posts: [
      /* 2 · 今天 */
      {
        no: 2,
        user: '상현',
        uimg: 'photos/av5.jpg',
        place: '',
        time: '今天',
        likes: 96,
        comments: 2,
        imgs: ['photos/shn0.jpg'],
        caption: '第一次和部长一起出差！！！',
        commentList: [
          { user: 'arno', color: '#4a90e2', img: 'photos/av1.jpg', text: '你现在在飞机上还能醒着，以后呢', time: '2 天', likes: 3 },
          { user: '99_God', color: '#666', img: 'photos/av99.png', text: '💙', time: '2 天', likes: 1 }
        ]
      },
      /* 6 · 两天前（排在 2 下方） */
      {
        no: 6,
        user: '상현',
        uimg: 'photos/av5.jpg',
        place: '',
        time: '两天前',
        likes: 64,
        comments: 5,
        imgs: ['photos/shn1.jpg', 'photos/shn2.jpg'],
        caption: '我放生了一次加班',
        commentList: [
          { user: 'jadedstill', color: '#e8875b', img: 'photos/av3.jpg', text: '整个公司就你下班最早', time: '2 天', likes: 8 },
          { user: '건우', color: '#5aa9e6', img: 'photos/av7.jpg', text: '工资没拿几毛还能说耍起就耍起', time: '2 天', likes: 5 },
          { user: 'leeeeesangwon', color: '#b06ab3', img: 'photos/av8.jpg', text: '致敬', time: '2 天', likes: 3 },
          { user: '신神', color: '#4a90e2', img: 'photos/av6.jpg', text: '我操，严肃学习', time: '2 天', likes: 4 },
          { user: '상현', color: '#7a9e9f', img: 'photos/av5.jpg', replyTo: '신神', text: '这好像是你教我的…', time: '2 天', likes: 2 }
        ]
      },
      /* 3 · 三天前 */
      {
        no: 3,
        user: '신神',
        uimg: 'photos/av6.jpg',
        place: '',
        time: '三天前',
        likes: 96,
        comments: 2,
        imgs: ['photos/sh1.jpg', 'photos/sh2.jpg'],
        caption: '和哥哥 😼',
        commentList: [
          { user: '준서', color: '#f2c14e', img: 'photos/av2.jpg', text: '可爱捏', time: '3 天', likes: 3 },
          { user: 'arno', color: '#4a90e2', img: 'photos/av1.jpg', text: '^^', time: '3 天', likes: 1 }
        ]
      },
      /* 7 · 四天前（排在 4 上方） */
      {
        no: 7,
        user: '신神',
        uimg: 'photos/av6.jpg',
        place: '',
        time: '四天前',
        likes: 52,
        comments: 3,
        imgs: ['photos/sh3.jpg'],
        caption: '샤오쭈',
        commentList: [
          { user: '상현', color: '#7a9e9f', img: 'photos/av5.jpg', text: '？？？', time: '1 周', likes: 2 },
          { user: 'arno', color: '#4a90e2', img: 'photos/av1.jpg', text: '？', time: '1 周', likes: 1 },
          { user: '상현', color: '#7a9e9f', img: 'photos/av5.jpg', replyTo: 'arno', text: '阿尼....', time: '1 周', likes: 0 }
        ]
      },
      /* 4 · 四天前 */
      {
        no: 4,
        user: 'arno',
        place: '',
        time: '四天前',
        likes: 73,
        comments: 0,
        likedBy: 'jadedstill',
        imgs: ['photos/ar1.jpg'],
        caption: '🎨👩‍🎨',
        commentList: []
      },
      /* 1 · 五天前 */
      {
        no: 1,
        user: 'leeeeesangwon',
        uimg: 'photos/av8.jpg',
        place: '',
        time: '五天前',
        likes: 88,
        comments: 2,
        likedBy: 'arno',
        imgs: ['photos/le1.jpg'],
        caption: '',
        commentList: [
          { user: 'jadedstill', color: '#e8875b', img: 'photos/av3.jpg', text: '这床有点好睡', time: '1 天', likes: 2 },
          { user: '준서', color: '#f2a65a', img: 'photos/av2.jpg', text: '不敢懂你的意思...', time: '1 天', likes: 1 }
        ]
      },
      /* 5 · 一周前 */
      {
        no: 5,
        user: 'jadedstill',
        uimg: 'photos/av3.jpg',
        place: '',
        time: '一周前',
        likes: 88,
        comments: 3,
        imgs: ['photos/st10.jpg'],
        caption: '🖤🖤🖤',
        commentList: [
          { user: 'leeeeesangwon', color: '#b06ab3', img: 'photos/av8.jpg', text: '放大看有小巧思。。。', time: '5 天', likes: 2 },
          { user: '신神', color: '#4a90e2', img: 'photos/av6.jpg', text: '你们俩再不回来公司都乱套了', time: '5 天', likes: 4 },
          { user: 'LONG', color: '#34c759', img: 'photos/av4.jpg', text: '出个公差搞得跟date似的', time: '5 天', likes: 6 }
        ]
      }
    ],
    /* 私信 */
    dms: [
      {
        name: '신神', color: '#4a90e2', img: 'photos/av6.jpg', time: '09:12', preview: '今晚老地方？', unread: 1,
        reply: '好呀，七点见。',
        msgs: [
          { me: false, text: '今晚老地方？', time: '09:12' }
        ]
      },
      {
        name: 'leeeeesangwon', color: '#b06ab3', img: 'photos/av8.jpg', time: '昨天', preview: '那个展览还去吗', unread: 0,
        reply: '去，周六下午？',
        msgs: [
          { me: true, text: '那个展览还去吗', time: '21:40' },
          { me: false, text: '去，你几点方便', time: '21:44' }
        ]
      },
      {
        name: '준서', color: '#f2c14e', img: 'photos/av2.jpg', time: '周一', preview: '照片我挑好了', unread: 0,
        reply: '那我等你的图。',
        msgs: [
          { me: false, text: '照片我挑好了', time: '18:20' }
        ]
      }
    ]
  },

  /* X · Arno 的私密账号（只写日记，仅自己可见） */
  x: {
    profile: {
      name: 'Arno',
      handle: '@arnojh777',
      bio: '私密账号',
      joined: '2024 年 3 月加入',
      posts: 0,
      following: 3,
      followers: 0
    },
    /* 只保留剧本里 Arno 给出的日记内容，原有预设已全部删除 */
    diary: []
  },

  /* 相册 */
  photos: [
    { img: 'photos/pg1.jpg' },
    { img: 'photos/pg2.jpg' },
    { img: 'photos/pg3.jpg' },
    { img: 'photos/pg4.jpg' },
    { img: 'photos/pg5.jpg' },
    { img: 'photos/pg6.jpg' },
    { img: 'photos/pg7.jpg' },
    { img: 'photos/pg8.jpg' },
    { img: 'photos/pg9.jpg' }
  ]
};
