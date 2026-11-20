import {readFileSync,writeFileSync} from 'fs';
import {chromium} from 'playwright-core';
const D='/data/hacknation/prezenter/docs/';
const md=readFileSync(D+'slajdy-szkic.md','utf8');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const inl=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/`(.+?)`/g,'<code>$1</code>');
const parts=md.split(/^## /m).slice(1);
let html=`<html><head><meta charset=utf8><style>
@page{size:1280px 720px;margin:0}body{margin:0;font-family:Arial,sans-serif}
.s{width:1280px;height:720px;box-sizing:border-box;padding:48px 64px;page-break-after:always;position:relative;overflow:hidden}
.bar{position:absolute;top:0;left:0;right:0;background:#b45309;color:#fff;font-size:15px;text-align:center;padding:4px}
h1{font-size:44px;margin:14px 0 22px;color:#1e3a5f}ul{font-size:25px;line-height:1.35;margin:0;padding-left:28px}li{margin-bottom:10px}
.t{display:flex;gap:32px}.t ul{flex:1}.im{display:flex;flex-wrap:wrap;gap:10px;width:430px}.im img{max-width:430px;max-height:230px;border:1px solid #ccc;object-fit:contain}
.t.w{flex-direction:column}.t.w .im{width:100%}.t.w .im img{max-width:1150px;max-height:260px;width:auto}.im.many img{max-width:205px;max-height:150px}code{background:#eee;padding:0 4px;font-size:.85em}.n{position:absolute;bottom:14px;right:24px;color:#888;font-size:14px}</style></head><body>`;
parts.forEach((p,i)=>{
 const lines=p.split('\n');const title=lines[0].replace(/^\d+\.\s*/,'');
 const imgs=[];const li=[];
 for(const l of lines.slice(1)){ if(!l.startsWith('- '))continue;
  let t=l.slice(2);
  t=t.replace(/!\[[^\]]*\]\(([^)]+)\)/g,(m,u)=>{imgs.push(u);return ''}).trim();
  if(t)li.push(t);}
 html+=`<div class=s><div class=bar>dane sztuczne — demonstracja</div><h1>${inl(title)}</h1><div class="t${imgs.some(u=>/wycinek/.test(u))?" w":""}"><ul>${li.map(x=>'<li>'+inl(x)+'</li>').join('')}</ul>${imgs.length?'<div class="im'+(imgs.length>2?' many':'')+'">'+imgs.map(u=>`<img src="file://${D}${u}">`).join('')+'</div>':''}</div><div class=n>${i+1}/${parts.length}</div></div>`;
});
html+='</body></html>';
writeFileSync('/tmp/pdfb/s.html',html);
const exe=process.argv[2];
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox','--allow-file-access-from-files']});
const pg=await b.newPage();await pg.goto('file:///tmp/pdfb/s.html');await pg.waitForTimeout(800);
await pg.pdf({path:D+'slajdy.pdf',width:'1280px',height:'720px',printBackground:true});
await b.close();console.log(parts.length);
