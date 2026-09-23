import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import {withBase} from '@/app/anatomy';

export type Lang = 'en' | 'zh-CN' | 'zh-TW';

export const LANGUAGES: {code: Lang; label: string; short: string}[] = [
  {code: 'en', label: 'English', short: 'EN'},
  {code: 'zh-CN', label: '简体中文', short: '简'},
  {code: 'zh-TW', label: '繁體中文', short: '繁'},
];

const STORAGE_KEY = 'atlas-lang';

export function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && (saved === 'en' || saved === 'zh-CN' || saved === 'zh-TW')) return saved;
  } catch {}
  const nav = window.navigator.language?.toLowerCase() ?? '';
  if (nav.startsWith('zh')) return nav.includes('tw') || nav.includes('hk') || nav.includes('hant') ? 'zh-TW' : 'zh-CN';
  return 'en';
}

type Dict = Record<string, string>;

const en: Dict = {
  'error.catalogue': 'The anatomy catalogue could not be loaded.',
  'header.eyebrow': 'INTERACTIVE ANATOMY',
  'header.title': 'Human Atlas',
  'header.edition': '3D',
  'header.meta': '{count} modeled pieces · BodyParts3D',
  'nav.search': 'Find a structure',
  'nav.about': 'About this atlas',
  'panel.systems.title': 'Systems',
  'panel.systems.close': 'Close systems',
  'preset.all': 'All',
  'preset.skeleton': 'Skeleton',
  'preset.organs': 'Organs',
  'system.showOnly': 'Show only {name}',
  'system.show': 'Show {name}',
  'panel.visibleCount': '{count} pieces visible',
  'panel.hideAll': 'Hide all',
  'search.title': 'Find a structure',
  'search.close': 'Close search',
  'search.placeholder': 'Heart, femur, cranial nerve…',
  'search.empty': 'No structures match your search.',
  'search.piece': 'piece',
  'search.pieces': 'pieces',
  'search.noteWithQuery': 'Showing up to 80 matches. Refine your search to find smaller structures.',
  'search.noteEmpty': 'Start with a major organ, or search every named structure.',
  'view.threeQuarter': 'Three-quarter view',
  'view.front': 'Front view',
  'view.side': 'Side view',
  'view.back': 'Back view',
  'view.pauseRotate': 'Pause rotation',
  'view.rotate': 'Rotate body',
  'view.reset': 'Reset view and layers',
  'caption.selected': 'SELECTED STRUCTURE',
  'caption.inventory': 'ANATOMICAL INVENTORY',
  'caption.separated': 'SEPARATED STRUCTURES',
  'caption.adult': 'ADULT HUMAN · MALE',
  'dock.systems': 'Systems',
  'dock.explode': 'Explode anatomy',
  'dock.assembled': 'Assembled',
  'dock.everyPiece': 'Every piece',
  'dock.reset': 'Reset',
  'dock.assembleReset': 'Assemble and reset',
  'footer.dragPan': 'Drag to pan',
  'footer.dragOrbit': 'Drag to orbit',
  'footer.zoom': 'Pinch to zoom',
  'footer.inspect': 'Tap to inspect',
  'footer.source': 'Source & credits',
  'loading.title': 'Preparing the anatomy',
  'loading.progress': '{progress}% · Loading {count} pieces',
  'error.reload': 'Reload viewer',
  'detail.anatomy': 'ANATOMY',
  'detail.systemOverview': 'System overview · structure identified from source anatomy',
  'detail.reference': 'Atlas reference',
  'detail.selectedPieces': 'Selected pieces',
  'detail.included': 'Included structures',
  'detail.more': 'And {count} more modeled pieces.',
  'detail.viewSource': 'View anatomical source',
  'detail.showSurrounding': 'Show surrounding anatomy',
  'detail.isolate': 'Isolate structure',
  'detail.clear': 'Clear selection',
  'about.eyebrow': 'SOURCE & SCOPE',
  'about.title': 'A body, revealed.',
  'about.subtitle': 'Explore the adult male reference anatomy from BodyParts3D.',
  'about.copy1.title': 'Male · BodyParts3D',
  'about.copy1.body': '2,234 individual meshes and 3,432 named concepts from an adult male reference anatomy.',
  'about.copy2': 'This reference does not contain every human structure or variation. Named concepts can contain multiple pieces; each source mesh is rendered once.',
  'about.copy3': 'Colors and system groupings are designed for exploration. The geometry is simplified for the web, and short explanations provide general educational context. This is an anatomical reference, not a diagnostic or surgical tool.',
  'about.sourceTitle': 'Source',
  'about.sourceBody': 'BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.',
  'about.license': 'Dataset license',
  'about.geometry': 'Original geometry & metadata',
  'about.publication': 'Read the source publication',
  'scene.webglError': 'This browser could not start the 3D viewer. Please try a browser with WebGL enabled.',
  'scene.loadError': 'Could not load the anatomy.',
  'scene.contextLost': 'The 3D session was paused by your device. Reload to continue.',
  'scene.geometryError': 'Could not assemble anatomy geometry.',
  'scene.aria': 'Interactive human anatomy. Drag to orbit, pinch or scroll to zoom, and tap a structure to inspect it.',
  'sheet.close': 'Close',
  'aria.layers': 'Anatomical layers',
  'aria.search': 'Find anatomy',
  'aria.camera': 'Camera controls',
};

const zhCN: Dict = {
  'error.catalogue': '解剖目录加载失败。',
  'header.eyebrow': '交互式解剖',
  'header.title': '人体图谱',
  'header.edition': '3D',
  'header.meta': '共 {count} 个结构模型 · 数据来源 BodyParts3D',
  'nav.search': '查找结构',
  'nav.about': '关于本图谱',
  'panel.systems.title': '系统',
  'panel.systems.close': '关闭系统列表',
  'preset.all': '全部',
  'preset.skeleton': '骨骼',
  'preset.organs': '脏器',
  'system.showOnly': '仅显示{name}',
  'system.show': '显示{name}',
  'panel.visibleCount': '当前显示 {count} 个结构',
  'panel.hideAll': '全部隐藏',
  'search.title': '查找结构',
  'search.close': '关闭搜索',
  'search.placeholder': '心脏、股骨、脑神经……',
  'search.empty': '没有找到匹配的结构。',
  'search.piece': '个部件',
  'search.pieces': '个部件',
  'search.noteWithQuery': '最多显示 80 条结果。缩小搜索范围可找到更精细的结构。',
  'search.noteEmpty': '从主要器官开始，或搜索任意已命名的结构。',
  'view.threeQuarter': '四分之三视图',
  'view.front': '正面视图',
  'view.side': '侧面视图',
  'view.back': '背面视图',
  'view.pauseRotate': '暂停旋转',
  'view.rotate': '自动旋转',
  'view.reset': '重置视图与图层',
  'caption.selected': '已选结构',
  'caption.inventory': '解剖结构总览',
  'caption.separated': '结构分离视图',
  'caption.adult': '成年男性 · 人体',
  'dock.systems': '系统',
  'dock.explode': '结构拆解',
  'dock.assembled': '组装状态',
  'dock.everyPiece': '逐个展开',
  'dock.reset': '重置',
  'dock.assembleReset': '组装并重置',
  'footer.dragPan': '拖动平移',
  'footer.dragOrbit': '拖动旋转',
  'footer.zoom': '捏合缩放',
  'footer.inspect': '点击查看',
  'footer.source': '数据来源与致谢',
  'loading.title': '正在加载解剖结构',
  'loading.progress': '{progress}% · 正在加载 {count} 个结构',
  'error.reload': '重新加载查看器',
  'detail.anatomy': '解剖结构',
  'detail.systemOverview': '系统概述 · 结构由源数据识别',
  'detail.reference': '图谱编号',
  'detail.selectedPieces': '已选部件',
  'detail.included': '包含的结构',
  'detail.more': '还有 {count} 个结构模型。',
  'detail.viewSource': '查看解剖数据来源',
  'detail.showSurrounding': '显示周围结构',
  'detail.isolate': '单独显示此结构',
  'detail.clear': '清除选择',
  'about.eyebrow': '数据来源与范围',
  'about.title': '人体，层层揭开。',
  'about.subtitle': '探索来自 BodyParts3D 的成年男性标准解剖结构。',
  'about.copy1.title': '男性 · BodyParts3D',
  'about.copy1.body': '基于成年男性标准解剖，包含 2,234 个独立网格模型与 3,432 个命名结构。',
  'about.copy2': '本参考并未涵盖人体所有结构与个体差异。命名结构可能由多个部件组成；每个源网格仅渲染一次。',
  'about.copy3': '颜色与系统分组旨在方便探索。几何体已为网页浏览做了简化，简短说明仅作一般科普参考。本工具为解剖参考资料，不可用于诊断或手术。',
  'about.sourceTitle': '数据来源',
  'about.sourceBody': 'BodyParts3D，© 生命科学数据库中心，采用 CC BY 4.0 国际许可协议。',
  'about.license': '数据集许可协议',
  'about.geometry': '原始几何与元数据',
  'about.publication': '阅读原始论文',
  'scene.webglError': '当前浏览器无法启动 3D 查看器，请使用支持 WebGL 的浏览器。',
  'scene.loadError': '解剖数据加载失败。',
  'scene.contextLost': '3D 会话已被设备暂停，请重新加载以继续。',
  'scene.geometryError': '无法组装解剖几何体。',
  'scene.aria': '交互式人体解剖。拖动可旋转视角，捏合或滚轮缩放，点击结构可查看详情。',
  'sheet.close': '关闭',
  'aria.layers': '解剖图层',
  'aria.search': '查找解剖结构',
  'aria.camera': '视角控制',
};

const zhTW: Dict = {
  'error.catalogue': '解剖目錄載入失敗。',
  'header.eyebrow': '互動式解剖',
  'header.title': '人體圖譜',
  'header.edition': '3D',
  'header.meta': '共 {count} 個結構模型 · 資料來源 BodyParts3D',
  'nav.search': '搜尋結構',
  'nav.about': '關於本圖譜',
  'panel.systems.title': '系統',
  'panel.systems.close': '關閉系統列表',
  'preset.all': '全部',
  'preset.skeleton': '骨骼',
  'preset.organs': '臟器',
  'system.showOnly': '僅顯示{name}',
  'system.show': '顯示{name}',
  'panel.visibleCount': '目前顯示 {count} 個結構',
  'panel.hideAll': '全部隱藏',
  'search.title': '搜尋結構',
  'search.close': '關閉搜尋',
  'search.placeholder': '心臟、股骨、腦神經……',
  'search.empty': '沒有找到符合的結構。',
  'search.piece': '個部件',
  'search.pieces': '個部件',
  'search.noteWithQuery': '最多顯示 80 筆結果。縮小搜尋範圍可找到更細緻的結構。',
  'search.noteEmpty': '從主要器官開始，或搜尋任意已命名的結構。',
  'view.threeQuarter': '四分之三視圖',
  'view.front': '正面視圖',
  'view.side': '側面視圖',
  'view.back': '背面視圖',
  'view.pauseRotate': '暫停旋轉',
  'view.rotate': '自動旋轉',
  'view.reset': '重設視圖與圖層',
  'caption.selected': '已選結構',
  'caption.inventory': '解剖結構總覽',
  'caption.separated': '結構分離視圖',
  'caption.adult': '成年男性 · 人體',
  'dock.systems': '系統',
  'dock.explode': '結構拆解',
  'dock.assembled': '組裝狀態',
  'dock.everyPiece': '逐個展開',
  'dock.reset': '重設',
  'dock.assembleReset': '組裝並重設',
  'footer.dragPan': '拖曳平移',
  'footer.dragOrbit': '拖曳旋轉',
  'footer.zoom': '捏合縮放',
  'footer.inspect': '點擊查看',
  'footer.source': '資料來源與致謝',
  'loading.title': '正在載入解剖結構',
  'loading.progress': '{progress}% · 正在載入 {count} 個結構',
  'error.reload': '重新載入檢視器',
  'detail.anatomy': '解剖結構',
  'detail.systemOverview': '系統概述 · 結構由源資料識別',
  'detail.reference': '圖譜編號',
  'detail.selectedPieces': '已選部件',
  'detail.included': '包含的結構',
  'detail.more': '還有 {count} 個結構模型。',
  'detail.viewSource': '查看解剖資料來源',
  'detail.showSurrounding': '顯示周圍結構',
  'detail.isolate': '單獨顯示此結構',
  'detail.clear': '清除選擇',
  'about.eyebrow': '資料來源與範圍',
  'about.title': '人體，層層揭開。',
  'about.subtitle': '探索來自 BodyParts3D 的成年男性標準解剖結構。',
  'about.copy1.title': '男性 · BodyParts3D',
  'about.copy1.body': '基於成年男性標準解剖，包含 2,234 個獨立網格模型與 3,432 個命名結構。',
  'about.copy2': '本參考並未涵蓋人體所有結構與個體差異。命名結構可能由多個部件組成；每個源網格僅渲染一次。',
  'about.copy3': '顏色與系統分組旨在方便探索。幾何體已為網頁瀏覽做了簡化，簡短說明僅作一般科普參考。本工具為解剖參考資料，不可用於診斷或手術。',
  'about.sourceTitle': '資料來源',
  'about.sourceBody': 'BodyParts3D，© 生命科學資料庫中心，採用 CC BY 4.0 國際授權條款。',
  'about.license': '資料集授權條款',
  'about.geometry': '原始幾何與後設資料',
  'about.publication': '閱讀原始論文',
  'scene.webglError': '目前瀏覽器無法啟動 3D 檢視器，請使用支援 WebGL 的瀏覽器。',
  'scene.loadError': '解剖資料載入失敗。',
  'scene.contextLost': '3D 工作階段已被裝置暫停，請重新載入以繼續。',
  'scene.geometryError': '無法組裝解剖幾何體。',
  'scene.aria': '互動式人體解剖。拖曳可旋轉視角，捏合或滾輪縮放，點擊結構可查看詳情。',
  'sheet.close': '關閉',
  'aria.layers': '解剖圖層',
  'aria.search': '搜尋解剖結構',
  'aria.camera': '視角控制',
};

const translations: Record<Lang, Dict> = {en, 'zh-CN': zhCN, 'zh-TW': zhTW};

function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, key) => (params[key] !== undefined ? String(params[key]) : `{${key}}`));
}

export function translate(lang: Lang, key: string, params?: Record<string, string | number>): string {
  const dict = translations[lang] ?? translations.en;
  const value = dict[key] ?? translations.en[key] ?? key;
  return interpolate(value, params);
}

/* ---- System names, descriptions, explanations ---- */

type SystemText = {name: string; description: string};

const systemTexts: Record<Lang, Record<string, SystemText>> = {
  en: {
    skeletal: {name: 'Skeleton', description: 'Bones form the supporting framework of the body, protect organs, and provide attachment points for muscles. Their internal tissue also stores minerals and produces blood cells.'},
    muscular: {name: 'Muscles', description: 'Skeletal muscles generate movement by pulling on their attachments. Together with tendons, they move joints, stabilize posture, and produce heat.'},
    cardiac: {name: 'Heart', description: 'The heart is a muscular pump with four chambers. Its valves direct blood forward through the pulmonary and systemic circuits.'},
    sensory: {name: 'Sensory organs', description: 'These structures contribute to special senses, including sight, hearing, and balance. Their specialized tissues detect stimuli and work with the nervous system to convey information.'},
    arterial: {name: 'Arteries', description: 'The heart drives blood through the circulation. Arteries carry blood away from the heart to supply tissues or, in the pulmonary circuit, to the lungs.'},
    venous: {name: 'Veins', description: 'Veins return blood toward the heart. Superficial and deep networks collect blood from the tissues; the pulmonary veins bring oxygenated blood back from the lungs.'},
    nervous: {name: 'Nervous system', description: 'The brain, spinal cord, and peripheral nerves carry and process signals. They support sensation, movement, coordination, and automatic regulation of body functions.'},
    respiratory: {name: 'Respiratory', description: 'The airways conduct air to the lungs, where oxygen and carbon dioxide move between air and blood. Breathing depends on pressure changes produced by respiratory muscles.'},
    digestive: {name: 'Digestive', description: 'The digestive tract breaks down food, absorbs nutrients and water, and moves waste onward. Accessory organs contribute bile and digestive enzymes.'},
    urinary: {name: 'Urinary', description: 'The kidneys filter blood and regulate fluid, electrolyte, and acid–base balance. Urine travels through the ureters to the bladder and exits through the urethra.'},
    lymphatic: {name: 'Lymphatic', description: 'Lymphatic vessels return excess tissue fluid to the circulation. Lymph nodes and other lymphoid organs support immune surveillance and responses.'},
    endocrine: {name: 'Endocrine', description: 'Endocrine organs release hormones into the blood to coordinate processes such as metabolism, growth, stress responses, and reproduction.'},
    reproductive: {name: 'Reproductive', description: 'The male reproductive structures represented here contribute to sperm production, maturation, transport, and the production of sex hormones.'},
    integumentary: {name: 'Body surface', description: 'The body surface provides an outer anatomical reference. The integumentary system forms a protective barrier and contributes to sensation and temperature regulation.'},
    connective: {name: 'Connective tissue', description: 'Cartilage, ligaments, and other connective tissues support, connect, and separate structures. Their roles include stabilizing joints and distributing mechanical loads.'},
  },
  'zh-CN': {
    skeletal: {name: '骨骼系统', description: '骨骼构成身体的支撑框架，保护脏器，并为肌肉提供附着点。骨组织还储存矿物质并生成血细胞。'},
    muscular: {name: '肌肉系统', description: '骨骼肌通过牵拉附着点产生运动。它们与肌腱协同活动关节、维持姿势并产生热量。'},
    cardiac: {name: '心脏', description: '心脏是一个具有四个腔室的肌性泵。心脏瓣膜引导血液沿肺循环和体循环单向流动。'},
    sensory: {name: '感觉器官', description: '这些结构参与视觉、听觉、平衡觉等特殊感觉。其特化组织感受刺激，并与神经系统协同传递信息。'},
    arterial: {name: '动脉', description: '心脏推动血液在循环系统中流动。动脉将血液从心脏运往全身组织，或经肺循环送往肺部。'},
    venous: {name: '静脉', description: '静脉将血液回流至心脏。浅静脉与深静脉网络收集组织中的血液；肺静脉则将含氧血从肺部送回心脏。'},
    nervous: {name: '神经系统', description: '脑、脊髓和周围神经负责传递和处理信号，支持感觉、运动、协调以及身体机能的自动调节。'},
    respiratory: {name: '呼吸系统', description: '气道将空气导入肺部，氧气与二氧化碳在此处进行气体交换。呼吸依赖呼吸肌产生的压力变化。'},
    digestive: {name: '消化系统', description: '消化道分解食物、吸收营养和水分，并排出废物。附属器官分泌胆汁和消化酶以助消化。'},
    urinary: {name: '泌尿系统', description: '肾脏过滤血液，调节体液、电解质和酸碱平衡。尿液经输尿管进入膀胱，再由尿道排出。'},
    lymphatic: {name: '淋巴系统', description: '淋巴管将多余的组织液回流至循环系统。淋巴结及其他淋巴器官负责免疫监视与免疫应答。'},
    endocrine: {name: '内分泌系统', description: '内分泌器官将激素释放入血，以协调代谢、生长、应激反应和生殖等生理过程。'},
    reproductive: {name: '生殖系统', description: '此处展示的男性生殖结构参与精子的产生、成熟、运输，以及性激素的分泌。'},
    integumentary: {name: '体表', description: '体表作为外部解剖参考。皮肤系统形成保护屏障，并参与感觉与体温调节。'},
    connective: {name: '结缔组织', description: '软骨、韧带等结缔组织起支撑、连接和分隔作用，包括稳定关节和分散机械负荷。'},
  },
  'zh-TW': {
    skeletal: {name: '骨骼系統', description: '骨骼構成身體的支撐框架，保護臟器，並為肌肉提供附著點。骨組織還儲存礦物質並生成血細胞。'},
    muscular: {name: '肌肉系統', description: '骨骼肌藉由牽拉附著點產生運動。它們與肌腱協同活動關節、維持姿勢並產生熱量。'},
    cardiac: {name: '心臟', description: '心臟是一個具有四個腔室的肌性幫浦。心臟瓣膜引導血液沿肺循環和體循環單向流動。'},
    sensory: {name: '感覺器官', description: '這些結構參與視覺、聽覺、平衡覺等特殊感覺。其特化組織感受刺激，並與神經系統協同傳遞資訊。'},
    arterial: {name: '動脈', description: '心臟推動血液在循環系統中流動。動脈將血液從心臟運往全身組織，或經肺循環送往肺部。'},
    venous: {name: '靜脈', description: '靜脈將血液回流至心臟。淺靜脈與深靜脈網路收集組織中的血液；肺靜脈則將含氧血從肺部送回心臟。'},
    nervous: {name: '神經系統', description: '腦、脊髓和周圍神經負責傳遞和處理訊號，支持感覺、運動、協調以及身體機能的自動調節。'},
    respiratory: {name: '呼吸系統', description: '氣道將空氣導入肺部，氧氣與二氧化碳在此處進行氣體交換。呼吸依賴呼吸肌產生的壓力變化。'},
    digestive: {name: '消化系統', description: '消化道分解食物、吸收營養和水分，並排出廢物。附屬器官分泌膽汁和消化酶以助消化。'},
    urinary: {name: '泌尿系統', description: '腎臟過濾血液，調節體液、電解質和酸鹼平衡。尿液經輸尿管進入膀胱，再由尿道排出。'},
    lymphatic: {name: '淋巴系統', description: '淋巴管將多餘的組織液回流至循環系統。淋巴結及其他淋巴器官負責免疫監視與免疫應答。'},
    endocrine: {name: '內分泌系統', description: '內分泌器官將激素釋放入血，以協調代謝、生長、應激反應和生殖等生理過程。'},
    reproductive: {name: '生殖系統', description: '此處展示的男性生殖結構參與精子的產生、成熟、運輸，以及性激素的分泌。'},
    integumentary: {name: '體表', description: '體表作為外部解剖參考。皮膚系統形成保護屏障，並參與感覺與體溫調節。'},
    connective: {name: '結締組織', description: '軟骨、韌帶等結締組織起支撐、連接和分隔作用，包括穩定關節和分散機械負荷。'},
  },
};

export function systemName(id: string, lang: Lang): string {
  return systemTexts[lang]?.[id]?.name ?? systemTexts.en[id]?.name ?? id;
}

export function systemDescription(id: string, lang: Lang): string {
  return systemTexts[lang]?.[id]?.description ?? systemTexts.en[id]?.description ?? '';
}

const explanationTexts: Record<Lang, Record<string, string>> = {
  en: {
    heart: 'A muscular pump in the chest. Its right side sends blood to the lungs; its left side sends blood through the systemic circulation.',
    liver: 'A large organ beneath the right side of the diaphragm. It processes absorbed nutrients, produces bile, and synthesizes many proteins carried in the blood.',
    brain: 'The central organ of the nervous system. Its interconnected regions support perception, movement, memory, language, and the regulation of bodily functions.',
    stomach: 'A muscular chamber between the esophagus and small intestine. It stores and mixes food with acid and enzymes before releasing it into the duodenum.',
    spleen: 'A lymphoid organ in the upper left abdomen. It filters blood, removes aging blood cells, and participates in immune responses.',
    pancreas: 'An abdominal organ with digestive and endocrine roles. It supplies enzymes to the small intestine and releases hormones including insulin and glucagon.',
    'urinary bladder': 'A muscular reservoir in the pelvis that stores urine arriving from the kidneys through the ureters.',
    trachea: 'The main airway connecting the larynx to the bronchi. Its cartilage supports keep the airway open during breathing.',
    diaphragm: 'A broad muscle separating the chest and abdomen. When it contracts, it increases chest volume and helps draw air into the lungs.',
  },
  'zh-CN': {
    heart: '位于胸腔的肌性泵。右心将血液泵入肺部，左心将血液泵入体循环。',
    liver: '位于膈右侧下方的大型器官。它处理吸收的营养物质、分泌胆汁，并合成多种血液中的蛋白质。',
    brain: '神经系统的中枢器官。其相互连接的区域负责感知、运动、记忆、语言以及身体机能的调节。',
    stomach: '位于食管与小肠之间的肌性囊袋。它储存食物，并将食物与胃酸和酶混合后送入十二指肠。',
    spleen: '位于左上腹的淋巴器官。它过滤血液、清除衰老的血细胞，并参与免疫应答。',
    pancreas: '位于腹腔的器官，兼具消化与内分泌功能。它向小肠分泌酶，并释放胰岛素、胰高血糖素等激素。',
    'urinary bladder': '位于盆腔的肌性储尿器官，储存经输尿管从肾脏运来的尿液。',
    trachea: '连接喉与支气管的主要气道。其软骨支架在呼吸时保持气道开放。',
    diaphragm: '分隔胸腔与腹腔的宽阔肌肉。收缩时扩大胸腔容积，协助将空气吸入肺部。',
  },
  'zh-TW': {
    heart: '位於胸腔的肌性幫浦。右心將血液泵入肺部，左心將血液泵入體循環。',
    liver: '位於膈右側下方的大型器官。它處理吸收的營養物質、分泌膽汁，並合成多種血液中的蛋白質。',
    brain: '神經系統的中樞器官。其相互連接的區域負責感知、運動、記憶、語言以及身體機能的調節。',
    stomach: '位於食道與小腸之間的肌性囊袋。它儲存食物，並將食物與胃酸和酶混合後送入十二指腸。',
    spleen: '位於左上腹的淋巴器官。它過濾血液、清除衰老的血細胞，並參與免疫應答。',
    pancreas: '位於腹腔的器官，兼具消化與內分泌功能。它向小腸分泌酶，並釋放胰島素、昇糖素等激素。',
    'urinary bladder': '位於骨盆腔的肌性儲尿器官，儲存經輸尿管從腎臟運來的尿液。',
    trachea: '連接喉與支氣管的主要氣道。其軟骨支架在呼吸時保持氣道開放。',
    diaphragm: '分隔胸腔與腹腔的寬闊肌肉。收縮時擴大胸腔容積，協助將空氣吸入肺部。',
  },
};

export function getExplanation(name: string, systemId: string, lang: Lang): string {
  const key = name.toLowerCase();
  const direct = explanationTexts[lang]?.[key] ?? explanationTexts.en[key];
  if (direct) return direct;
  return systemDescription(systemId, lang);
}

export function hasDirectExplanation(name: string): boolean {
  return !!explanationTexts.en[name.toLowerCase()];
}

/* ---- Structure name translations ---- */

const nameCache: Partial<Record<Lang, Record<string, string>>> = {};

async function loadNameMap(lang: Lang): Promise<Record<string, string>> {
  if (nameCache[lang]) return nameCache[lang]!;
  if (lang === 'en') { nameCache.en = {}; return {}; }
  const url = withBase(`/models/names-${lang}.json`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load names-${lang}.json`);
  const map = await res.json() as Record<string, string>;
  nameCache[lang] = map;
  return map;
}

/* ---- React context ---- */

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  tn: (name: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({children}: {children: ReactNode}) {
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang());
  const [nameMap, setNameMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    if (lang === 'en') { setNameMap({}); return; }
    let cancelled = false;
    loadNameMap(lang).then(map => { if (!cancelled) setNameMap(map); }).catch(() => {});
    return () => { cancelled = true; };
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(lang, key, params),
    [lang],
  );

  const tn = useCallback(
    (name: string) => nameMap[name] ?? name,
    [nameMap],
  );

  const value = useMemo(() => ({lang, setLang, t, tn}), [lang, setLang, t, tn]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
