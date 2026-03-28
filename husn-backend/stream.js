import 'dotenv/config';
import NodeMediaServer from 'node-media-server';
import { Server } from 'socket.io';
import path from 'path';

const config = {
  rtmp: {
    port: parseInt(process.env.RTMP_PORT) || 1935, 
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*',
    // ✅ التعديل الصحيح: خليه يقرأ من مجلد husn-backend مباشرة
    mediaroot: '/home/ubuntu/husn-backend' 
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        // ✅ تأكدي إن المسار هنا يطابق المجلد اللي أنشأناه
        hlsPath: '/home/ubuntu/husn-backend/media/live',
        hlsFlags: '[hls_time=2:hls_list_size=3:flags=delete_segments]'
      }
    ]
  }
};

// تشغيل السيرفر
var nms = new NodeMediaServer(config);
nms.run();

// تشغيل السوكيت على بورت 8001
const io = new Server(8001, {
  cors: { origin: "*" }
});

console.log("HUSN Stream Server is LIVE! 🚀");

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('Drone Connected. Path:', StreamPath);
  if (args && Object.keys(args).length > 0) {
    io.emit('telemetry-update', args);
  }
});

io.on('connection', (socket) => {
  console.log('Dashboard connected to Telemetry ✅');
});