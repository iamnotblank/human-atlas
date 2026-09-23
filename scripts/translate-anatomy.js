/**
 * Translate all anatomical structure names in atlas.json into
 * Simplified Chinese (zh-CN) and Traditional Chinese (zh-TW).
 * Self-contained: uses only built-in Node.js modules.
 * Usage: node scripts/translate-anatomy.js
 */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelsDir = path.join(__dirname, '..', 'public', 'models');

// 1. WORD DICTIONARY — 834 unique lowercase words → Chinese
const W = {
  '4':'4','11':'11','12':'12',
  'ii':'Ⅱ','iii':'Ⅲ','iv':'Ⅳ','ix':'Ⅸ','v':'Ⅴ','vi':'Ⅵ','vii':'Ⅶ','viii':'Ⅷ',
  first:'第一',second:'第二',third:'第三',fourth:'第四',fifth:'第五',sixth:'第六',
  seventh:'第七',eighth:'第八',ninth:'第九',tenth:'第十',eleventh:'第十一',twelfth:'第十二',
  left:'左',right:'右',anterior:'前',posterior:'后',superior:'上',inferior:'下',
  medial:'内侧',lateral:'外侧',proximal:'近侧',distal:'远侧',superficial:'浅',deep:'深',
  central:'中央',external:'外',internal:'内',median:'正中',
  anterolateral:'前外侧',posteromedial:'后内侧',inferomedial:'下内侧',
  antero:'前',dorsal:'背侧',cranial:'颅',caudal:'尾',
  upper:'上',lower:'下',ascending:'升',descending:'降',
  vertical:'纵',oblique:'斜',transverse:'横',
  apicoposterior:'尖后',laterobasal:'外侧底',mediobasal:'内侧底',
  paracentral:'中央旁',supramarginal:'缘上',precuneal:'楔前',
  postcentral:'中央后',precentral:'中央前',circumflex:'旋',
  body:'体',region:'区',regions:'区',zone:'区',part:'部',parts:'部',portion:'部',
  division:'部',subdivision:'亚部',subdivisionof:'亚部',sector:'段',subsector:'亚段',
  subsegmental:'亚段',segment:'段',segmental:'段',wall:'壁',
  layer:'层',leaf:'叶',leaflet:'瓣',plate:'板',
  arch:'弓',space:'间隙',compartment:'腔隙',cavity:'腔',chamber:'腔',
  canal:'管',canaliculus:'小管',incisure:'切迹',
  foramen:'孔',fossa:'窝',process:'突',
  tuber:'结节',line:'线',linea:'线',
  raphe:'缝',sinus:'窦',recess:'隐窝',ampulla:'壶腹',isthmus:'峡',
  apex:'尖',apical:'尖',base:'底',basal:'底',
  pole:'极',polar:'极',hilum:'门',hilus:'门',neck:'颈',
  head:'头',capitis:'头',root:'根',tip:'尖',
  formation:'结构',continuity:'连续',conduit:'管道',
  cluster:'群',clusters:'群',set:'组',tree:'树',
  branch:'支',branches:'支',tributary:'属支',
  trunk:'干',anastomosis:'吻合',variant:'变异',
  entity:'实体',structure:'结构',organ:'器官',organs:'器官',
  system:'系统',systemic:'系统性',apparatus:'器',complex:'复合体',
  component:'组成部分',content:'内容物',material:'物质',immaterial:'非物质',
  physical:'实体',heterogeneous:'异质性',boundary:'界',border:'缘',
  surface:'面',investing:'包被',
  capsule:'囊',membrane:'膜',membranous:'膜',fascia:'筋膜',fasciae:'筋膜',fascial:'筋膜',
  septum:'隔',septal:'隔',valve:'瓣',
  corpus:'体',callosum:'胼胝',cavernosum:'海绵体',spongiosum:'海绵体',
  striatum:'纹状',alba:'白',nigrum:'黑',
  externus:'外',internus:'内',profundus:'深',superficialis:'浅',
  longus:'长',brevis:'短',breves:'短',magnus:'大',major:'大',maximus:'大',
  minimus:'小',minimi:'小',medius:'中',minor:'小',tertius:'第三',
  lata:'阔',latae:'阔',libera:'游离',
  longi:'长',longissimus:'最长',
  radialis:'桡侧',ulnaris:'尺侧',tibialis:'胫侧',fibularis:'腓侧',
  superioris:'上',inferioris:'下',medialis:'内侧',lateralis:'外侧',
  communis:'总',proprius:'固有',accessorius:'副',
  anconeus:'肘肌',aryepiglotticus:'杓会厌',
  abdomen:'腹',abdominal:'腹',abdominis:'腹',abdomen:'腹',
  abdominal:'腹',abdomen:'腹',
  adrenal:'肾上腺',suprarenal:'肾上腺',
  amygdala:'杏仁核',anus:'肛门',anal:'肛',ani:'肛',
  aorta:'主动脉',aortic:'主动脉',
  appendage:'附件',appendicular:'附肢',appendix:'阑尾',
  aqueduct:'水管',arm:'臂',artery:'动脉',arteries:'动脉',arteria:'动脉',arterial:'动脉',
  atrium:'心房',atrial:'心房',
  axis:'枢椎',atlas:'寰椎',
  back:'背',brain:'脑',brainstem:'脑干',
  bladder:'膀胱',bone:'骨',bony:'骨',osseous:'骨',
  bronchus:'支气管',bronchial:'支气管',bronchopulmonary:'支气管肺',
  cardinal:'主',cardiovascular:'心血管',
  carotid:'颈动脉',carpal:'腕',carpi:'腕',cartilage:'软骨',cartilaginous:'软骨',
  caudate:'尾状',cava:'腔',caval:'腔',cavernous:'海绵',
  cavitated:'腔',cecal:'盲肠',cecum:'盲肠',
  celiac:'腹腔',coeliac:'腹腔',cell:'细胞',
  cephalic:'头',cerebellar:'小脑',cerebelli:'小脑',cerebellum:'小脑',
  cerebral:'大脑',cervical:'颈',cervicis:'颈',
  chest:'胸',chiasm:'交叉',choroid:'脉络膜',choroidal:'脉络膜',
  ciliary:'睫状',ciliaris:'睫状',cingulate:'扣带',circle:'环',
  circumventricular:'室周',clavicle:'锁骨',clavicular:'锁骨',
  coccygeus:'尾骨肌',coli:'结肠',colic:'结肠',collateral:'侧支',
  colli:'颈',colliculus:'丘',colon:'结肠',column:'柱',commissure:'连合',
  common:'总',communicating:'交通',concha:'鼻甲',connective:'结缔',
  constrictor:'缩肌',conus:'圆锥',cord:'索',cornea:'角膜',
  corniculate:'小角',corona:'冠',coronary:'冠状动脉',cortex:'皮层',
  corticomedullary:'皮髓质',costal:'肋',costarum:'肋',costocervical:'肋颈',
  cranial:'颅',cricoid:'环状',cricothyroid:'环甲',
  cubital:'肘',cuboid:'骰骨',cuneiform:'楔骨',cusp:'瓣尖',
  cystic:'胆囊',
  decussation:'交叉',deferent:'输精',deltoid:'三角肌',
  diagonal:'斜',diaphragm:'膈',diencephalon:'间脑',digastric:'二腹肌',
  digital:'趾',digiti:'趾',digitorum:'趾',
  disk:'盘',dorsum:'背',dorsalis:'背侧',duct:'管',duodenum:'十二指肠',
  dura:'硬',ear:'耳',elasticus:'弹性',endocrine:'内分泌',
  epidermis:'表皮',epididymis:'附睾',epigastric:'腹上',
  epiglottic:'会厌',epiglottis:'会厌',epiploic:'网膜',
  epithalamus:'上丘脑',epithelium:'上皮',esophageal:'食管',esophagus:'食管',
  oesophageal:'食管',ethmoid:'筛骨',ethmoidal:'筛',
  extensor:'伸肌',extra:'外',extrahepatic:'肝外',extrinsic:'外在',
  eye:'眼',eyeball:'眼球',eyebrow:'眉',eyelid:'睑',
  face:'面',facial:'面',false:'假',faucial:'咽门',
  femoral:'股',femoris:'股',femur:'股骨',fibrous:'纤维',fibula:'腓骨',
  fibular:'腓',fibularis:'腓骨',finger:'指',flat:'扁',flexor:'屈肌',floating:'浮',
  foot:'足',foramen:'孔',forearm:'前臂',forebrain:'前脑',fornix:'穹隆',
  fourth:'第四',free:'游离',frontal:'额',frontobasal:'额底',fusiform:'梭形',
  gallbladder:'胆囊',ganglion:'神经节',gastric:'胃',gastro:'胃',
  gastrocnemius:'腓肠肌',gastroduodenal:'胃十二指肠',gastroepiploic:'胃网膜',
  gastrointestinal:'胃肠',gemellus:'孖肌',genicular:'膝',geniculate:'膝',
  genioglossus:'颏舌肌',geniohyoid:'颏舌骨肌',genital:'生殖',gingiva:'牙龈',
  girdle:'带',gland:'腺',glans:'头',globus:'球',gluteal:'臀',gluteus:'臀肌',
  gracilis:'股薄肌',gray:'灰',great:'大',gyrus:'回',
  habenula:'缰',hair:'毛',hairs:'毛',hallucis:'拇',hamate:'钩骨',hand:'手',
  head:'头',heart:'心',hemiazygos:'半奇',hemiliver:'半肝',hemisphere:'半球',
  hepatic:'肝',hepatovenous:'肝静脉',hindbrain:'后脑',hip:'髋',
  hippocampal:'海马',hippocampus:'海马',hollow:'空',human:'人体',
  humeral:'肱',humerus:'肱骨',hyo:'舌骨',hyoglossus:'舌骨舌肌',hyoid:'舌骨',
  hypothalamic:'下丘脑',hypothalamus:'下丘脑',hypothenar:'小鱼际',
  ileal:'回肠',ileocecal:'回盲',ileocolic:'回结肠',ileum:'回肠',
  iliac:'髂',iliacus:'髂肌',iliococcygeus:'髂尾肌',iliocostalis:'髂肋肌',
  iliolumbar:'髂腰',iliotibial:'髂胫',
  in:'于',incisor:'切',index:'食指',indicis:'食指',inferior:'下',
  inflow:'流入',infrahyoid:'舌骨下',infraspinatus:'冈下肌',infratrochlear:'滑车下',
  innermost:'最内',insula:'岛叶',insular:'岛',integument:'皮肤',integumentary:'皮肤',
  intercostal:'肋间',intermediate:'中间',intermediomedial:'中间内侧',intermedius:'中间',
  interossei:'骨间肌',interosseous:'骨间',interpeduncular:'脚间',
  interspinales:'棘间',interspinalis:'棘间肌',
  intertransversarii:'横突间',intertransversarius:'横突间',
  interventricular:'室间',intervertebral:'椎间',intestine:'肠',
  intracranial:'颅内',intrahepatic:'肝内',intrapulmonary:'肺内',
  intrinsic:'内在',investing:'包被',iris:'虹膜',irregular:'不规则',
  jaw:'颌',jejunum:'空肠',jugular:'颈静脉',junction:'交界',
  kidney:'肾',knee:'膝',
  lacrimal:'泪',lake:'湖',lamina:'板',large:'大',
  laryngeal:'喉',laryngopharynx:'喉咽',larynx:'喉',
  lateral:'外侧',lateralis:'外侧',leg:'腿',lens:'晶状体',
  levator:'提肌',levatores:'提肌',
  ligament:'韧带',limb:'肢',limbic:'边缘',lingular:'舌',lip:'唇',little:'小',
  liver:'肝',lobar:'叶',lobe:'叶',lobular:'小叶',lobule:'小叶',
  long:'长',longi:'长',longus:'长',loose:'疏松',lumbar:'腰',lumborum:'腰',
  lumbrical:'蚓状肌',lumbricals:'蚓状肌',lunate:'月骨',lung:'肺',
  main:'主',mammillary:'乳头',mandible:'下颌骨',mandibular:'下颌',
  manubrium:'胸骨柄',marginal:'缘',mater:'膜',matter:'质',
  maxilla:'上颌骨',maxillary:'上颌',maximus:'大',
  medial:'内侧',medialis:'内侧',median:'正中',mediastinum:'纵隔',
  medius:'中',medulla:'髓质',medullaris:'髓质',
  mesenteric:'肠系膜',mesentery:'肠系膜',mesoappendix:'阑尾系膜',
  mesocolica:'结肠系膜',mesocolon:'结肠系膜',
  metacarpal:'掌骨',metatarsal:'跖骨',metencephalon:'后脑',midbrain:'中脑',
  middle:'中',mitral:'二尖瓣',molar:'磨',mons:'耻丘',mouth:'口',
  mucoid:'黏液',muscle:'肌',musculature:'肌',musculophrenic:'肌膈',
  musculoskeletal:'肌骨',mylohyoid:'下颌舌骨肌',myocardial:'心肌',myocardium:'心肌',
  nasal:'鼻',nasociliary:'鼻睫',nasolacrimal:'鼻泪',navicular:'舟骨',
  neck:'颈',nerve:'神经',nervous:'神经',network:'网',neural:'神经',neuraxis:'神经轴',
  neurocranium:'颅',nose:'鼻',nuclear:'核',nucleus:'核',
  oblique:'斜',obliquus:'斜',oblongata:'延髓',obturator:'闭孔',
  occipital:'枕',ocular:'眼',oculomotor:'动眼',
  of:'的',omentalis:'网膜',omohyoid:'肩胛舌骨肌',
  ophthalmic:'眼',opponens:'对掌肌',optic:'视',orbit:'眶',orbital:'眶',
  organ:'器官',organs:'器官',osseous:'骨',outflow:'流出',
  palate:'腭',palatine:'腭',palatini:'腭',palatopharyngeus:'腭咽肌',
  pallidus:'苍白球',palmar:'掌',palmaris:'掌',palpebrae:'睑',
  pancreas:'胰腺',pancreatic:'胰',pancreaticobiliary:'胰胆',
  pancreaticoduodenal:'胰十二指肠',papillary:'乳头',paracentral:'中央旁',
  parahippocampal:'海马旁',parasympathetic:'副交感',parenchyma:'实质',
  parenchymatous:'实质',parietal:'顶',patella:'髌骨',patellar:'髌',
  pectineus:'耻骨肌',pectoral:'胸',pectoralis:'胸肌',
  pedis:'足',peduncle:'脚',pelvic:'盆',pelvis:'盆',penis:'阴茎',
  perforating:'穿',pericallosal:'胼胝周',perineal:'会阴',perineum:'会阴',
  peritoneal:'腹膜',peritoneum:'腹膜',phalanx:'趾骨',pharyngeal:'咽',pharynx:'咽',
  phrenic:'膈',pineal:'松果体',piriformis:'梨状肌',pisiform:'豌豆骨',
  pituitary:'垂体',plantar:'跖',plantaris:'跖肌',platysma:'颈阔肌',
  plexus:'丛',pneumatized:'气化',polar:'极',pollicis:'拇',pons:'脑桥',pontine:'脑桥',
  popliteal:'腘',popliteus:'腘肌',portal:'门',portion:'部',
  postcommunicating:'交通后',posterior:'后',postvertebral:'椎后',
  pre:'前',precommunicating:'交通前',prefrontal:'额前',premolar:'前磨',
  prevertebral:'椎前',princeps:'本',process:'突',profundus:'深',
  pronator:'旋前肌',proper:'固有',prostate:'前列腺',proximal:'近侧',
  psoas:'腰大肌',pterygomandibular:'翼下颌',
  pubic:'耻骨',pubis:'耻骨',pubococcygeus:'耻尾肌',puborectalis:'耻直肠肌',
  pudendal:'阴部',pulmonary:'肺',pulmopleural:'肺胸膜',putamen:'壳',
  quadratus:'股方肌',quadriceps:'股四头肌',
  radial:'桡',radialis:'桡',radius:'桡骨',raphe:'缝',
  rectal:'直肠',rectum:'直肠',rectus:'直肌',recurrent:'返',
  region:'区',regions:'区',renal:'肾',respiratory:'呼吸',
  retina:'视网膜',retinaculum:'支持带',rhomboid:'菱形肌',rib:'肋',right:'右',
  ring:'环',root:'根',rotator:'回旋肌',
  sac:'囊',sacral:'骶',sacrum:'骶骨',salivary:'唾液',
  salpingopharyngeus:'咽鼓管咽肌',saphenous:'隐',sartorius:'缝匠肌',
  scalene:'斜角肌',scalenus:'斜角肌',scaphoid:'舟骨',scapula:'肩胛骨',
  scapulae:'肩胛骨',scapular:'肩胛',sclera:'巩膜',secondary:'次',
  sector:'段',segment:'段',segmental:'段',
  semimembranosus:'半膜肌',seminal:'精',semispinalis:'半棘肌',semitendinosus:'半腱肌',
  septal:'隔',serous:'浆膜',serratus:'锯肌',sesamoid:'籽骨',
  set:'组',seventh:'第七',short:'短',shoulder:'肩',side:'侧',
  sigmoid:'乙状',sinus:'窦',sixth:'第六',skeletal:'骨',skeleton:'骨',
  skin:'皮肤',skull:'颅',small:'小',soft:'软',soleus:'比目鱼肌',solid:'实',
  space:'间隙',sphenoid:'蝶骨',sphincter:'括约肌',spinal:'脊髓',spinalis:'棘肌',
  spleen:'脾',splenial:'夹',splenic:'脾',splenius:'夹肌',spongiosum:'海绵体',
  sternal:'胸骨',sternocleidomastoid:'胸锁乳突肌',sternocostal:'胸肋',
  sternohyoid:'胸骨舌骨肌',sternothyroid:'胸骨甲状肌',sternum:'胸骨',stomach:'胃',
  straight:'直',stria:'纹',structure:'结构',stylohyoid:'茎突舌骨肌',
  stylopharyngeus:'茎突咽肌',subaortic:'主动脉下',subarachnoid:'蛛网膜下',
  subclavian:'锁骨下',subclavius:'锁骨下肌',subcortex:'皮层下',subcostal:'肋下',
  subdivision:'亚部',subdivisionof:'亚部',subendocardial:'心内膜下',
  sublingual:'舌下',submandibular:'下颌下',suboccipital:'枕下',
  subscapular:'肩胛下',subscapularis:'肩胛下肌',subsector:'亚段',
  subsuperior:'亚上',sulcus:'沟',
  superficial:'浅',superficialis:'浅',superior:'上',superioris:'上',
  supinator:'旋后肌',supra:'上',suprahyoid:'舌骨上',supramarginal:'缘上',
  suprarenal:'肾上腺',suprascapular:'肩胛上',supraspinatus:'冈上肌',
  supratrochlear:'滑车上',supreme:'最上',suspensory:'悬',symphysis:'联合',
  system:'系统',systemic:'系统',
  taenia:'带',talus:'距骨',tarsal:'跗骨',tectum:'顶盖',telencephalon:'端脑',
  temporal:'颞',temporo:'颞',tendinous:'腱',tendon:'肌腱',tensor:'张肌',
  tenth:'第十',tentorium:'幕',teres:'圆肌',terminal:'终',terminalis:'终',
  testicular:'睾丸',testis:'睾丸',
  thalamogeniculate:'丘脑膝状体',thalamoperforating:'丘脑穿通',thalamus:'丘脑',
  thenar:'鱼际',thigh:'股',third:'第三',thoracic:'胸',thoracis:'胸',
  thoraco:'胸',thoracodorsal:'胸背',thorax:'胸',thumb:'拇',thymus:'胸腺',
  thyro:'甲状',thyrocervical:'甲状颈',thyrohyoid:'甲状舌骨',thyroid:'甲状',
  tibia:'胫骨',tibial:'胫',tibialis:'胫骨',tissue:'组织',
  to:'至',toe:'趾',tongue:'舌',tooth:'牙',trachea:'气管',
  tracheobronchial:'气管支气管',tract:'束',transverse:'横',transversus:'横肌',
  trapezium:'大多角骨',trapezius:'斜方肌',trapezoid:'小多角骨',tree:'树',
  tributary:'属支',triceps:'三头肌',tricuspid:'三尖瓣',trigeminal:'三叉',
  triquetral:'三角骨',trochlea:'滑车',trochlear:'滑车',true:'真',trunk:'干',
  tuber:'结节',twelfth:'第十二',typical:'典型',
  ulna:'尺骨',ulnar:'尺',ulnaris:'尺骨',upper:'上',
  ureter:'输尿管',ureteric:'输尿管',urethra:'尿道',urinary:'泌尿',
  uvula:'悬雍垂',uvular:'悬雍垂',
  valve:'瓣',variant:'变异',vascular:'血管',vasculature:'血管系统',vastus:'股',
  vein:'静脉',veins:'静脉',veli:'帆',vena:'静脉',venous:'静脉',
  ventricle:'心室',ventricular:'心室',vermian:'蚓',vertebra:'椎骨',vertebrae:'椎骨',
  vertebral:'椎',vertical:'纵',vesicle:'囊',
  visceral:'脏层',viscerocranium:'面颅',vitreous:'玻璃体',vivo:'活',
  vocal:'声带',vocalis:'声带肌',vomer:'犁骨',
  wall:'壁',white:'白',with:'伴',wrist:'腕',xiphoid:'剑突',zygomatic:'颧',
  // additional words found in data
  check:'支撑',curtain:'帘',nonparenchymatous:'非实质',nonskeletal:'非骨',
  big:'大',proper:'固有',archicortex:'古皮层',arcuate:'弓状',alar:'翼',
  anatomical:'解剖',angular:'角',antebrachial:'前臂',articular:'关节',
  arytenoid:'杓状',atypical:'非典型',auriculotemporal:'耳颞',autonomic:'自主',
  axial:'轴',axillary:'腋',azygos:'奇',basicranial:'颅底',basicranium:'颅底',
  basilar:'基底',basilic:'贵要',biceps:'二头肌',bile:'胆',biliary:'胆道',
  callosomarginal:'胼胝体缘',canine:'犬',capitate:'头状骨',circumflex:'旋',
  decussation:'交叉',diaphragm:'膈',elasticus:'弹性',epithelium:'上皮',
  extrinsic:'外在',frontobasal:'额底',globus:'球',intermediate:'中间',
  intermedioedial:'中间内侧',interossei:'骨间肌',intracranial:'颅内',
  intrahepatic:'肝内',intrapulmonary:'肺内',intrinsic:'内在',irregular:'不规则',
  jejunum:'空肠',junction:'交界',lacrimal:'泪',lake:'湖',lamina:'板',
  large:'大',laryngeal:'喉',laryngopharynx:'喉咽',larynx:'喉',laterobasal:'外侧底',
  lobar:'叶',lobule:'小叶',lobular:'小叶',longi:'长',longissimus:'最长',
  lumbrical:'蚓状肌',lumborum:'腰',lunate:'月骨',magnus:'大',mammillary:'乳头',
  marginal:'缘',mater:'膜',matter:'质',maxilla:'上颌骨',mediobasal:'内侧底',
  medullaris:'髓质',mesenteric:'肠系膜',mesentery:'肠系膜',mesoappendix:'阑尾系膜',
  mesocolica:'结肠系膜',mesocolon:'结肠系膜',metacarpal:'掌骨',metatarsal:'跖骨',
  midbrain:'中脑',minimi:'小',minimus:'小',minor:'小',mitral:'二尖瓣',
  molar:'磨',mons:'耻丘',mouth:'口',mucoid:'黏液',musculature:'肌',
  musculophrenic:'肌膈',musculoskeletal:'肌骨',mylohyoid:'下颌舌骨肌',
  myocardial:'心肌',myocardium:'心肌',nasal:'鼻',nasociliary:'鼻睫',
  nasolacrimal:'鼻泪',navicular:'舟骨',network:'网',neural:'神经',neuraxis:'神经轴',
  neurocranium:'颅',ninth:'第九',nonparenchymatous:'非实质',nonskeletal:'非骨',
  nose:'鼻',nuclear:'核',oblique:'斜',obliquus:'斜',oblongata:'延髓',
  obturator:'闭孔',occipital:'枕',ocular:'眼',oculomotor:'动眼',
  oesophageal:'食管',omentalis:'网膜',omohyoid:'肩胛舌骨肌',ophthalmic:'眼',
  opponens:'对掌肌',optic:'视',orbit:'眶',orbital:'眶',osseous:'骨',outflow:'流出',
  palate:'腭',palatine:'腭',palatini:'腭',palatopharyngeus:'腭咽肌',pallidus:'苍白球',
  palmar:'掌',palmaris:'掌',palpebrae:'睑',pancreas:'胰腺',pancreatic:'胰',
  pancreaticobiliary:'胰胆',pancreaticoduodenal:'胰十二指肠',papillary:'乳头',
  parahippocampal:'海马旁',parasympathetic:'副交感',parenchyma:'实质',
  parenchymatous:'实质',parietal:'顶',patella:'髌骨',patellar:'髌',pectineus:'耻骨肌',
  pectoral:'胸',pectoralis:'胸肌',pedis:'足',peduncle:'脚',pelvic:'盆',pelvis:'盆',
  penis:'阴茎',perforating:'穿',pericallosal:'胼胝周',perineal:'会阴',perineum:'会阴',
  peritoneal:'腹膜',peritoneum:'腹膜',phalanx:'趾骨',pharyngeal:'咽',pharynx:'咽',
  phrenic:'膈',pineal:'松果体',piriformis:'梨状肌',pisiform:'豌豆骨',pituitary:'垂体',
  plantar:'跖',plantaris:'跖肌',plate:'板',platysma:'颈阔肌',plexus:'丛',
  pneumatized:'气化',polar:'极',pollicis:'拇',pontine:'脑桥',popliteal:'腘',
  popliteus:'腘肌',portal:'门',postcentral:'中央后',postcommunicating:'交通后',
  postvertebral:'椎后',pre:'前',precentral:'中央前',precommunicating:'交通前',
  precuneal:'楔前',prefrontal:'额前',premolar:'前磨',prevertebral:'椎前',
  princeps:'本',profundus:'深',pronator:'旋前肌',prostate:'前列腺',
  proximal:'近侧',psoas:'腰大肌',pterygomandibular:'翼下颌',pubic:'耻骨',pubis:'耻骨',
  pubococcygeus:'耻尾肌',puborectalis:'耻直肠肌',pudendal:'阴部',pulmopleural:'肺胸膜',
  putamen:'壳',quadratus:'股方肌',quadriceps:'股四头肌',radius:'桡骨',
  rectus:'直肌',recurrent:'返',renal:'肾',respiratory:'呼吸',retina:'视网膜',
  rhomboid:'菱形肌',rotator:'回旋肌',sac:'囊',sacral:'骶',sacrum:'骶骨',
  salivary:'唾液',salpingopharyngeus:'咽鼓管咽肌',saphenous:'隐',sartorius:'缝匠肌',
  scalene:'斜角肌',scalenus:'斜角肌',scaphoid:'舟骨',scapula:'肩胛骨',
  scapulae:'肩胛骨',scapular:'肩胛',sclera:'巩膜',secondary:'次',
  semimembranosus:'半膜肌',seminal:'精',semispinalis:'半棘肌',semitendinosus:'半腱肌',
  septal:'隔',serous:'浆膜',serratus:'锯肌',sesamoid:'籽骨',seventh:'第七',
  shoulder:'肩',side:'侧',sigmoid:'乙状',skeletal:'骨',skeleton:'骨',skin:'皮肤',
  skull:'颅',small:'小',soft:'软',soleus:'比目鱼肌',solid:'实',space:'间隙',
  sphenoid:'蝶骨',sphincter:'括约肌',spinal:'脊髓',spinalis:'棘肌',spleen:'脾',
  splenial:'夹',splenic:'脾',splenius:'夹肌',sternal:'胸骨',
  sternocleidomastoid:'胸锁乳突肌',sternocostal:'胸肋',sternohyoid:'胸骨舌骨肌',
  sternothyroid:'胸骨甲状肌',sternum:'胸骨',stomach:'胃',straight:'直',stria:'纹',
  stylohyoid:'茎突舌骨肌',stylopharyngeus:'茎突咽肌',subaortic:'主动脉下',
  subarachnoid:'蛛网膜下',subclavian:'锁骨下',subclavius:'锁骨下肌',subcortex:'皮层下',
  subcostal:'肋下',subendocardial:'心内膜下',sublingual:'舌下',submandibular:'下颌下',
  suboccipital:'枕下',subscapular:'肩胛下',subscapularis:'肩胛下肌',subsuperior:'亚上',
  sulcus:'沟',superficialis:'浅',superioris:'上',supinator:'旋后肌',supra:'上',
  suprahyoid:'舌骨上',suprarenal:'肾上腺',suprascapular:'肩胛上',supraspinatus:'冈上肌',
  supratrochlear:'滑车上',supreme:'最上',suspensory:'悬',symphysis:'联合',
  taenia:'带',talus:'距骨',tarsal:'跗骨',tectum:'顶盖',telencephalon:'端脑',
  temporal:'颞',temporo:'颞',tendinous:'腱',tendon:'肌腱',tensor:'张肌',
  tentorium:'幕',teres:'圆肌',terminal:'终',terminalis:'终',tertius:'第三',
  testicular:'睾丸',testis:'睾丸',thalamus:'丘脑',thenar:'鱼际',thigh:'股',
  third:'第三',thoracic:'胸',thoracis:'胸',thoraco:'胸',thoracodorsal:'胸背',
  thorax:'胸',thumb:'拇',thymus:'胸腺',thyro:'甲状',thyrocervical:'甲状颈',
  thyrohyoid:'甲状舌骨',thyroid:'甲状',tibia:'胫骨',tibial:'胫',tibialis:'胫骨',
  tissue:'组织',toe:'趾',tongue:'舌',tooth:'牙',trachea:'气管',
  tracheobronchial:'气管支气管',tract:'束',transversus:'横肌',trapezium:'大多角骨',
  trapezius:'斜方肌',trapezoid:'小多角骨',tributary:'属支',triceps:'三头肌',
  tricuspid:'三尖瓣',trigeminal:'三叉',triquetral:'三角骨',trochlea:'滑车',
  trochlear:'滑车',true:'真',tuber:'结节',twelfth:'第十二',typical:'典型',
  ulna:'尺骨',ulnar:'尺',ulnaris:'尺骨',upper:'上',ureter:'输尿管',ureteric:'输尿管',
  urethra:'尿道',urinary:'泌尿',uvula:'悬雍垂',uvular:'悬雍垂',vastus:'股',
  vein:'静脉',veins:'静脉',veli:'帆',vena:'静脉',venous:'静脉',ventricle:'心室',
  ventricular:'心室',vermian:'蚓',vertebra:'椎骨',vertebrae:'椎骨',vertebral:'椎',
  vertical:'纵',vesicle:'囊',visceral:'脏层',viscerocranium:'面颅',vitreous:'玻璃体',
  vivo:'活',vocal:'声带',vocalis:'声带肌',vomer:'犁骨',wall:'壁',white:'白',
  with:'伴',wrist:'腕',xiphoid:'剑突',zone:'区',zygomatic:'颧',
  // 19 missing words found during verification
  abductor:'展肌',accessory:'副',acromial:'肩峰',adductor:'收肌',
  alimentary:'消化',brachial:'肱',brachialis:'肱肌',brachii:'臂',
  brachiocephalic:'头臂',brachioradialis:'肱桡肌',brachium:'臂',
  cage:'笼',calcaneal:'跟骨',calcaneus:'跟骨',cardiac:'心',
  cheek:'颊',cinereum:'灰',coracobrachialis:'喙肱肌',crico:'环'
};

// 2. PHRASE DICTIONARY — multi-word terms that don't compose word-by-word
const P = {
  'abductor digiti minimi':'小指展肌','abductor hallucis':'拇展肌',
  'abductor pollicis brevis':'拇短展肌','abductor pollicis longus':'拇长展肌',
  'adductor brevis':'短收肌','adductor longus':'长收肌','adductor magnus':'大收肌',
  'adductor minimus':'小收肌','adductor hallucis':'拇收肌','adductor pollicis':'拇收肌',
  'extensor carpi radialis brevis':'桡侧腕短伸肌','extensor carpi radialis longus':'桡侧腕长伸肌',
  'extensor carpi ulnaris':'尺侧腕伸肌','extensor digiti minimi':'小指伸肌',
  'extensor digitorum':'趾伸肌','extensor digitorum longus':'趾长伸肌',
  'extensor digitorum brevis':'趾短伸肌','extensor hallucis brevis':'拇短伸肌',
  'extensor hallucis longus':'拇长伸肌','extensor indicis':'食指伸肌',
  'flexor carpi radialis':'桡侧腕屈肌','flexor carpi ulnaris':'尺侧腕屈肌',
  'flexor digiti minimi brevis':'小指短屈肌','flexor digitorum longus':'趾长屈肌',
  'flexor digitorum brevis':'趾短屈肌','flexor digitorum profundus':'趾深屈肌',
  'flexor digitorum superficialis':'趾浅屈肌','flexor hallucis brevis':'拇短屈肌',
  'flexor hallucis longus':'拇长屈肌','flexor pollicis brevis':'拇短屈肌',
  'flexor pollicis longus':'拇长屈肌','flexor retinaculum':'屈肌支持带',
  'opponens digiti minimi':'小指对掌肌','opponens pollicis':'拇对掌肌',
  'pronator teres':'旋前圆肌','pronator quadratus':'旋前方肌',
  'tensor fasciae latae':'阔筋膜张肌','tensor veli palatini':'腭帆张肌',
  'levator palpebrae superioris':'上睑提肌','levator ani':'肛提肌',
  'constrictor muscle of pharynx':'咽缩肌','external anal sphincter':'肛门外括约肌',
  'thoracic rotator':'胸回旋肌','cervical rotator':'颈回旋肌',
  'corpus callosum':'胼胝体','corpus cavernosum':'海绵体','corpus spongiosum':'尿道海绵体',
  'vena cava':'腔静脉','dura mater':'硬膜','porta hepatis':'肝门',
  'portal vein':'门静脉','hepatic portal vein':'肝门静脉',
  'thoracic duct':'胸导管','azygos vein':'奇静脉','hemiazygos vein':'半奇静脉',
  'accessory hemiazygos vein':'副半奇静脉','brachiocephalic artery':'头臂干',
  'celiac trunk':'腹腔干','celiac artery':'腹腔动脉','arch of aorta':'主动脉弓',
  'ascending aorta':'升主动脉','abdominal aorta':'腹主动脉','abdominal part':'腹部',
  'central canal of spinal cord':'脊髓中央管','caudate lobe':'尾状叶',
  'body of sternum':'胸骨体','gingiva of upper jaw':'上颌牙龈',
  'gingiva of lower jaw':'下颌牙龈','left lower first secondary molar tooth':'左下第一继乳磨牙',
  'hair of head':'头部毛发','left adrenal gland':'左肾上腺','left kidney':'左肾',
  'right kidney':'右肾','left ureter':'左输尿管','right ureter':'右输尿管',
  'left lobe of thymus':'左胸腺叶','right lobe of thymus':'右胸腺叶',
  'corpus cavernosum of penis':'阴茎海绵体','corpus spongiosum of penis':'尿道海绵体',
  'glans penis':'阴茎头','hepatovenous segment ix':'肝静脉段Ⅸ',
  'inferior vena cava':'下腔静脉','superior vena cava':'上腔静脉',
  'right anterior cerebral artery':'右大脑前动脉','left anterior cerebral artery':'左大脑前动脉',
  'anterior communicating artery':'前交通动脉','anterior cardiac vein':'心前静脉',
  'anterior cecal artery':'盲肠前动脉','anterior commissure':'前连合',
  'anterior inferior cerebellar artery':'小脑前下动脉',
  'anterior interventricular vein':'前室间静脉',
  'anterior leaflet of mitral valve':'二尖瓣前瓣',
  'anterior leaflet of tricuspid valve':'三尖瓣前瓣',
  'anterior papillary muscle of right ventricle':'右心室前乳头肌',
  'anterior cusp of aortic valve':'主动脉瓣前尖',
  'anterior division of left renal artery':'左肾动脉前支',
  'anterior division of right renal artery':'右肾动脉前支',
  'appendicular artery':'阑尾动脉','basilar artery':'基底动脉',
  'caudal pancreatic artery':'胰尾动脉','bronchial artery':'支气管动脉',
  'ascending colon':'升结肠','ascending lumbar vein':'腰升静脉',
  'skeleton (in vivo)':'骨骼（活体）',
  'region of anterior sector of left liver (in-vivo)':'左肝前段区（活体）',
  'region of anterior sector of right liver (in-vivo)':'右肝前段区（活体）',
  'region of posterior sector of right liver (in-vivo)':'右肝后段区（活体）',
  'left choroid':'左脉络膜','right choroid':'右脉络膜',
  'left anterior ethmoidal nerve':'左筛前神经',
  'left ciliary ganglion':'左睫状神经节','left frontal nerve':'左额神经',
  'left inferior oblique':'左下斜肌','left inferior rectus':'左下直肌',
  'left lateral rectus':'左外直肌','left medial rectus':'左内直肌',
  'check ligament of left lateral rectus':'左外直肌支持韧带',
  'check ligament of left medial rectus':'左内直肌支持韧带',
  'trochlea of left superior oblique':'左上斜肌滑车',
  'left supra-orbital nerve':'左眶上神经',
  'left gastro-epiploic artery':'左胃网膜动脉',
  'right gastro-epiploic artery':'右胃网膜动脉',
  'pre-hepatic portal vein':'肝前门静脉',
  'hyo-epiglottic ligament':'舌骨会厌韧带',
  'thoraco-acromial artery':'胸肩峰动脉',
  'left lateral crico-arytenoid':'左环杓侧肌',
  'left posterior crico-arytenoid':'左环杓后肌',
  'left thyro-arytenoid':'左甲杓肌',
  'right lateral crico-arytenoid':'右环杓侧肌',
  'right posterior crico-arytenoid':'右环杓后肌',
  'right thyro-arytenoid':'右甲杓肌',
  'biceps brachii':'肱二头肌','triceps brachii':'肱三头肌',
  'calcaneal tendon':'跟腱','tuber cinereum':'灰结节',
  'calcaneal branch':'跟骨支','thoracic vertebrae':'胸椎',
  'cervical vertebrae':'颈椎','lumbar vertebrae':'腰椎',
  'thoraco-acromial artery':'胸肩峰动脉',
  'deep brachial artery':'肱深动脉','brachial artery':'肱动脉',
  'medial brachial vein':'肱内侧静脉','brachial vein':'肱静脉',
  'cervical intertransversarii':'颈横突间肌',
  'interspinales cervicis':'颈棘间肌','interspinales lumborum':'腰棘间肌',
  'levatores costarum breves':'短肋提肌','levatores costarum longi':'长肋提肌',
  'dorsal interossei':'背侧骨间肌','palmar interossei':'掌侧骨间肌',
  'plantar digital arteries':'足底趾动脉','plantar digital veins':'足底趾静脉',
  'dorsal digital arteries':'背侧趾动脉','dorsal digital veins':'背侧趾静脉',
  'dorsal metacarpal arteries':'掌背动脉','common plantar digital arteries':'足底总动脉',
  'plantar digital arteries proper':'足底固有趾动脉',
  'oesophageal branch':'食管支','bronchial branch':'支气管支',
  'anterior intercostal vein':'前肋间静脉','perforating artery':'穿动脉',
  'perforating vein':'穿静脉','calcaneal branch of posterior tibial artery':'胫后动脉跟骨支',
  // brain ventricles (not cardiac)
  'third ventricle':'第三脑室','fourth ventricle':'第四脑室',
  'lateral ventricle':'侧脑室','left lateral ventricle':'左侧脑室',
  'right lateral ventricle':'右侧脑室','interventricular foramen':'室间孔',
  'central canal of spinal cord':'脊髓中央管',
  // avoid duplicate characters (word already contains the suffix)
  'adrenal gland':'肾上腺','urinary bladder':'膀胱',
  'molar tooth':'磨牙','premolar tooth':'前磨牙','incisor tooth':'切牙',
  'canine tooth':'犬齿','secondary molar':'继乳磨牙',
  'secondary premolar':'继乳前磨牙','secondary incisor':'继乳切牙',
  'secondary canine':'继乳犬齿',
  'left adrenal gland':'左肾上腺','right adrenal gland':'右肾上腺',
  'urinary bladder':'膀胱',
};

// 3. EXACT NAME DICTIONARY — full names needing special handling
const EXACT = {
  'Atlas':'寰椎','Axis':'枢椎','Spleen':'脾','Pancreas':'胰腺',
  'Appendix':'阑尾','Stomach':'胃','Liver':'肝','Skin':'皮肤',
  'Eyebrow':'眉','Heart':'心','Thymus':'胸腺','Prostate':'前列腺',
  'Pharynx':'咽','Larynx':'喉','Tongue':'舌','Tooth':'牙',
  'Uvula':'悬雍垂','Vomer':'犁骨','Scapula':'肩胛骨','Clavicle':'锁骨',
  'Sternum':'胸骨','Patella':'髌骨','Femur':'股骨','Tibia':'胫骨',
  'Fibula':'腓骨','Humerus':'肱骨','Radius':'桡骨','Ulna':'尺骨',
  'Calcaneus':'跟骨','Talus':'距骨','Navicular':'舟骨','Lunate':'月骨',
  'Scaphoid':'舟骨','Hamate':'钩骨','Capitate':'头状骨','Pisiform':'豌豆骨',
  'Trapezium':'大多角骨','Trapezoid':'小多角骨','Cuneiform':'楔骨','Cuboid':'骰骨',
  'Mandible':'下颌骨','Maxilla':'上颌骨','Zygomatic':'颧骨','Frontal':'额骨',
  'Parietal':'顶骨','Occipital':'枕骨','Temporal':'颞骨','Sphenoid':'蝶骨',
  'Ethmoid':'筛骨','Palatine':'腭骨','Lacrimal':'泪骨','Nasal':'鼻骨',
  'Pineal body':'松果体','Pituitary gland':'垂体',
  'abdomen':'腹','abdomen proper':'腹本部','brain':'脑','brainstem':'脑干',
  'midbrain':'中脑','hindbrain':'后脑','forebrain':'前脑',
  'diencephalon':'间脑','telencephalon':'端脑','metencephalon':'后脑',
  'connective':'结缔','cardiovascular':'心血管','respiratory':'呼吸',
  'digestive':'消化','urinary':'泌尿','reproductive':'生殖',
  'nervous':'神经','endocrine':'内分泌','lymphatic':'淋巴',
  'musculoskeletal':'肌骨','integumentary':'皮肤','skeletal':'骨骼',
  'sensory':'感觉','muscular':'肌肉','arterial':'动脉','venous':'静脉',
  'vascular tree':'血管树','segment of artery':'动脉段','variant artery':'变异动脉',
  'cerebellum':'小脑','human':'人体','skeleton':'骨骼','abdomen':'腹',
};

// 4. WORD CLASSES for composition rules
const ACTIONS = new Set([
  'abductor','adductor','flexor','extensor','pronator','supinator','opponens',
  'rotator','levator','depressor','tensor','constrictor','dilator','sphincter',
]);
const FIRSTLAST = new Set([
  'corpus','ramus','radix','lobus','lobulus','cornu','hilum','hilus',
  'caput','collum','cervix','vena','arteria','nervus','ductus',
  'ligamentum','cartilago','cavitas','canalis','fissura','sulcus',
  'foramen','processus','truncus','conus','nodus','ganglion','nucleus',
  'cortex','columna','tractus','commissura','decussatio','ventriculus',
  'atrium','papilla','plica','valvula','ostium','meatus','gyrus',
  'septum','fenestra',
]);

// 5. TRANSLATION ENGINE
function translatePhrase(phrase) {
  if (!phrase) return '';
  const lower = phrase.toLowerCase().trim();
  if (!lower) return '';
  if (P[lower]) return P[lower];
  if (EXACT[lower]) return EXACT[lower];
  if (W[lower] && !lower.includes(' ')) return W[lower];
  const words = lower.split(/[\s-]+/).filter(Boolean);
  if (!words.length) return '';
  const parts = words.map(w => W[w]);
  if (parts.some(p => !p)) return '';
  if (words.length >= 2 && ACTIONS.has(words[0])) {
    return parts.slice(1).join('') + parts[0];
  }
  if (words.length >= 2 && FIRSTLAST.has(words[0])) {
    return parts.slice(1).join('') + parts[0];
  }
  return parts.join('');
}

function translateSegment(seg) {
  if (!seg) return '';
  const lower = seg.toLowerCase().trim();
  if (P[lower]) return P[lower];
  if (EXACT[lower]) return EXACT[lower];
  // Handle "X to Y"
  const toM = seg.match(/^(.+?)\s+to\s+(.+)$/i);
  if (toM) {
    const a = translatePhrase(toM[1]);
    const b = translatePhrase(toM[2]);
    if (a && b) return a + '至' + b;
    return '';
  }
  // Extract side prefix within segment (e.g. "right adductor hallucis")
  let side = '';
  const sm = seg.match(/^(Left|Right)\s+(.*)/i);
  if (sm) {
    side = W[sm[1].toLowerCase()] || '';
    seg = sm[2];
    const segLower = seg.toLowerCase();
    if (P[segLower]) return side + P[segLower];
    if (EXACT[segLower]) return side + EXACT[segLower];
  }
  const result = translatePhrase(seg);
  return result ? side + result : '';
}

function translateName(name) {
  if (!name || !name.trim()) return '';
  if (EXACT[name]) return EXACT[name];
  let paren = '';
  const pm = name.match(/\(([^)]+)\)/);
  if (pm) {
    paren = '(' + translateName(pm[1]) + ')';
    name = name.replace(/\s*\([^)]+\)\s*/g, '').trim();
  }
  const setM = name.match(/^set of\s+(.+)$/i);
  if (setM) {
    const inner = translateName(setM[1]);
    if (!inner) return '';
    return inner + '组' + paren;
  }
  let side = '';
  const sm = name.match(/^(Left|Right)\s+(.*)/i);
  if (sm) {
    side = W[sm[1].toLowerCase()] || '';
    name = sm[2];
  }
  if (EXACT[name]) return side + EXACT[name] + paren;
  const lower = name.toLowerCase();
  if (P[lower]) return side + P[lower] + paren;
  const ofParts = name.split(/\s+of\s+/i);
  if (ofParts.length > 1) {
    const translated = ofParts.map(p => translateSegment(p));
    if (translated.some(p => !p)) return '';
    return side + translated.reverse().join('') + paren;
  }
  const result = translateSegment(name);
  if (!result) return '';
  return side + result + paren;
}

// 6. SIMPLIFIED → TRADITIONAL CHINESE CHARACTER CONVERSION
// Compact paired strings: each simplified char → corresponding traditional char
const S_CHARS = '万与丑专业丛东丝丢两严丧个临为丽举义乌习乡书买乱争亏亚产仅从仑仓亿们价众优会伟传伤伦伪伫体余劳华单卖占卤厂历县双变叠号叶吨听启员呜咏团园坏坚坛坝坟垒垫垮城埋埔域培基堡堤堪报场壶备复够头夸夹奋奖套妆妇妈姗孤学孩宁宝实审宫害尽层局岛岩岭峰崇崽川州巢差帮帽幅干并幸广庄庆序应底度廊廉弃弊式归当录形彩径循微德忆忧怀态怜总恼悦悬惊惨惯愤慌慑懒戏战房扁扇承护担拟拥拦拧拨择挂挟挤挥挽捏捕损捡换捣据捱捧捷捺捻掀掌探接掠掩措掺揉描握揣揭援揽搁搂搅摆摇摊摔摘摩撑撕撞播擒擅擦擘擞支收改攻放政故效敌敏救敢散敬数敲整文斋斐斑斗斩断新方施旁旅旋旌无智暂暴曙替最会月有朋服期术杀条来杨杰松极构枢枪查柯柱柄栏树栓校样根格案桥桨梁梢梅梗梳梯械梭检棱棉棋棍棒棕棚森椅植输练组细织终给绘绝统继绪绍经绑绒结绕络编缘缠缩缝罗罚罢罪罩骂羁狱美群翘耀翅老者聪聊聍肃肄肺肾肿胀胁胆背胃脐脑脚肠肤腔腥腰腹膀脂膜膊膈脉脏腱腺';
const T_CHARS = '萬與醜專業叢東絲丟兩嚴喪個臨為麗舉義烏習鄉書買亂爭虧亞產僅從崙倉億們價眾優會偉傳傷倫偽佇體餘勞華單賣佔鹵廠歷縣雙變疊號葉噸聽啟員嗚詠團園壞堅壇壩墳壘墊垮城埋埔域培基堡堤堪報場壺備復夠頭誇夾奮獎套妝婦媽姍孤學孩寧寶實審宮害盡層局島岩嶺峰崇崽川州巢差幫帽幅幹並幸廣莊慶序應底度廊廉棄弊式歸當錄形彩徑循微德憶憂懷態憐總惱悅懸驚慘慣憤慌懾懶戲戰房扁扇承護擔擬擁攔擰撥擇掛挾擠揮輓捏捕損撿換搗據捱捧捷捺捻掀掌探接掠掩措摻揉描握揣揭援攬擱摟攪擺搖攤摔摘摩撐撕撞播擒擅擦擘擻支收改攻放政故效敵敏救敢散敬數敲整文齋斐斑鬥斬斷新方施旁旅旋旌無智暫暴曙替最會月有朋服期術殺條來楊傑鬆極構樞槍查柯柱柄欄樹栓校樣根格案橋槳梁梢梅梗梳梯械梭檢稜棉棋棍棒棕棚森椅植輸練組細織終給繪絕統繼緒紹經綁絨結繞絡編緣纏縮縫羅罰罷罪罩罵羈獄美群翹耀翅老者聰聊聏肅肄肺腎腫脹脅膽背胃臍腦腳腸膚腔腥腰腹膀脂膜膊膈脈臟腱腺';
const S2T = {};
for (let i = 0; i < S_CHARS.length; i++) S2T[S_CHARS[i]] = T_CHARS[i];
// Additional medical character pairs not in the compact strings above
Object.assign(S2T, {节:'節',质:'質',网:'網',睑:'瞼',颌:'頜',龈:'齦',巩:'鞏',齿:'齒',颅:'顱',骶:'骶',髋:'髖',髌:'髕',韧:'韌',颈:'頸',颊:'頰',颜:'顏',额:'額',骨:'骨',髓:'髓',龙:'龍',龟:'龜',侧:'側',线:'線',茎:'莖',胫:'脛'});
function toTraditional(s) {
  return Array.from(s).map(c => S2T[c] || c).join('');
}

// 7. MAIN LOGIC
const atlas = JSON.parse(fs.readFileSync(path.join(modelsDir, 'atlas.json'), 'utf8'));
const nameSet = new Set();
const nameSystem = new Map();
for (const p of atlas.parts) {
  nameSet.add(p.name);
  if (!nameSystem.has(p.name)) nameSystem.set(p.name, p.system);
}
for (const c of atlas.concepts) {
  nameSet.add(c.name);
  if (!nameSystem.has(c.name)) nameSystem.set(c.name, 'concept');
}

const zhCN = {};
const zhTW = {};
const untranslated = [];

for (const name of nameSet) {
  const cn = translateName(name);
  if (cn) {
    zhCN[name] = cn;
    zhTW[name] = toTraditional(cn);
  } else {
    untranslated.push(name);
  }
}

// Write output files
fs.writeFileSync(path.join(modelsDir, 'names-zh-CN.json'), JSON.stringify(zhCN, null, 2));
fs.writeFileSync(path.join(modelsDir, 'names-zh-TW.json'), JSON.stringify(zhTW, null, 2));

// Print summary
console.log(`Total names: ${nameSet.size}`);
console.log(`Translated: ${Object.keys(zhCN).length}`);
console.log(`Untranslated: ${untranslated.length}`);
if (untranslated.length) {
  console.log('\nUntranslated names:');
  for (const n of untranslated.slice(0, 50)) console.log('  ' + n);
  if (untranslated.length > 50) console.log(`  ... and ${untranslated.length - 50} more`);
}

// Sample translations by system
console.log('\n=== Sample translations by system ===');
const systems = [...new Set([...nameSystem.values()])].sort();
for (const sys of systems) {
  console.log(`\n--- ${sys} ---`);
  const samples = [...nameSet].filter(n => nameSystem.get(n) === sys).slice(0, 10);
  for (const n of samples) {
    console.log(`  ${n} → ${zhCN[n] || '[UNTRANSLATED]'}`);
  }
}
