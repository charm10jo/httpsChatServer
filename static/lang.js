let send_form = {
    Symptoms : "",
    Necessary_Medical_Measures : "",
    just_some_medicines : "",
    need_Doctor_medical_measures : "",
    Emergency_Room : "",

    Searching_Priority : "",
    Near_Distance : "",
    Support_your_Language : "",
    send : "",

    bot_translation : "",
    bot_hospital_name : "",
    bot_hospital_addr : "",
    bot_language : "",
    bot_route : "",
    bot_retry : "",

}



function change_lang(lang){
    switch (lang) {
        case "en" : 
                send_form.Symptoms = "Symptoms",
                send_form.Necessary_Medical_Measures = "Necessary Medical Measures",
                send_form.just_some_medicines = "just some medicines",
                send_form.need_Doctor_medical_measures = "need Doctor medical measures",
                send_form.Emergency_Room = "Emergency Room",
                send_form.Searching_Priority = "Searching Priority",
                send_form.Near_Distance = "Near Distance",
                send_form.Support_your_Language = "Support your Language",
                send_form.bot_translation =  "translated sentence";
                send_form.bot_hospital_name =  "hospital name";
                send_form.bot_hospital_addr =  "hospital address";
                send_form.bot_language =  "support language";
                send_form.bot_route =  "Recommended Medical Facility Route";
                send_form.bot_retry =  "If this is not the information you want";
                send_form.send = "send";
            break;
        case "zh-TW" : 
                send_form.Symptoms = "症状",
                send_form.Necessary_Medical_Measures = "必要的医疗措施",
                send_form.just_some_medicines = "只是一些药物",
                send_form.need_Doctor_medical_measures = "需要医生医疗措施",
                send_form.Emergency_Room = "急救室",
                send_form.Searching_Priority = "搜索优先级",
                send_form.Near_Distance = "近距离",
                send_form.Support_your_Language = "支持你的语言",
                send_form.bot_translation =  "译文";
                send_form.bot_hospital_name =  "医院名称";
                send_form.bot_hospital_addr =  "医院地址";
                send_form.bot_language =  "支持语言";
                send_form.bot_route =  "推荐医疗设施路线";
                send_form.bot_retry =  "如果这不是您想要的信息";
                send_form.send = "发送";
            break;
        case "zh-CN" : 
                send_form.Symptoms = "症狀",
                send_form.Necessary_Medical_Measures = "必要的醫療措施",
                send_form.just_some_medicines = "只是一些藥物",
                send_form.need_Doctor_medical_measures = "需要醫生醫療措施",
                send_form.Emergency_Room = "急救室",
                send_form.Searching_Priority = "搜索優先級",
                send_form.Near_Distance = "近距離",
                send_form.Support_your_Language = "支持你的語言",
                send_form.bot_translation =  "譯文";
                send_form.bot_hospital_name =  "醫院名稱";
                send_form.bot_hospital_addr =  "醫院地址";
                send_form.bot_language =  "支持語言";
                send_form.bot_route =  "推薦醫療設施路線";
                send_form.bot_retry =  "如果這不是您想要的信息";
                send_form.send = "發送";
            break;
        case "vi" : 
                send_form.Symptoms = "Triệu chứng",
                send_form.Necessary_Medical_Measures = "Các biện pháp y tế cần thiết",
                send_form.just_some_medicines = "chỉ là một số loại thuốc",
                send_form.need_Doctor_medical_measures = "cần Bác sĩ các biện pháp y tế",
                send_form.Emergency_Room = "Phòng cấp cứu",
                send_form.Searching_Priority = "Ưu tiên tìm kiếm",
                send_form.Near_Distance = "khoảng cách gần",
                send_form.Support_your_Language = "Hỗ trợ ngôn ngữ của bạn",
                send_form.bot_translation =  "câu dịch";
                send_form.bot_hospital_name =  "tên bệnh viện";
                send_form.bot_hospital_addr =  "địa chỉ bệnh viện";
                send_form.bot_language =  "ngôn ngữ hỗ trợ";
                send_form.bot_route =  "Lộ trình cơ sở y tế được đề xuất";
                send_form.bot_retry =  "Nếu đây không phải là thông tin bạn muốn";
                send_form.send = "gửi";
            break;
        case "mn" : 
                send_form.Symptoms = "Шинж тэмдэг",
                send_form.Necessary_Medical_Measures = "Шаардлагатай эмнэлгийн арга хэмжээ",
                send_form.just_some_medicines = "зүгээр л зарим э",
                send_form.need_Doctor_medical_measures = "Эмч эмнэлгийн арга хэмжээ авах шаардлагатай",
                send_form.Emergency_Room = "Яаралтай тусламжийн өрөө",
                send_form.Searching_Priority = "Хайлтын тэргүүлэх чиглэл",
                send_form.Near_Distance = "Ойролцоох",
                send_form.Support_your_Language = "Хэлээ дэмжээрэй",
                send_form.bot_translation =  "орчуулсан өгүүлбэр";
                send_form.bot_hospital_name =  "эмнэлгийн нэр";
                send_form.bot_hospital_addr =  "эмнэлгийн хаяг";
                send_form.bot_language =  "дэмжлэг хэл";
                send_form.bot_route =  "Эмнэлгийн байгууламжийн санал болгож буй маршрут";
                send_form.bot_retry =  "Хэрэв энэ нь таны хүссэн мэдээлэл биш бол";
                send_form.send = "илгээх";
            break;
        case "th" : 
                send_form.Symptoms = "อาการ",
                send_form.Necessary_Medical_Measures = "มาตรการทางการแพทย์ที่จำเป็น",
                send_form.just_some_medicines = "ยาบางชนิด",
                send_form.need_Doctor_medical_measures = "ต้องการมาตรการทางการแพทย์ของแพทย์",
                send_form.Emergency_Room = "ห้องฉุกเฉิน",
                send_form.Searching_Priority = "ลำดับความสำคัญในการค้นหา",
                send_form.Near_Distance = "ระยะทางใกล้",
                send_form.Support_your_Language = "รองรับภาษาของคุณ",
                send_form.bot_translation =  "ประโยคแปล";
                send_form.bot_hospital_name =  "ชื่อโรงพยาบาล";
                send_form.bot_hospital_addr =  "ที่อยู่โรงพยาบาล";
                send_form.bot_language =  "รองรับภาษา";
                send_form.bot_route =  "เส้นทางสถานพยาบาลที่แนะนำ";
                send_form.bot_retry =  "หากนี่ไม่ใช่ข้อมูลที่คุณต้องการ";
                send_form.send = "ส่ง";
            break;
        case "ru" : 
                send_form.Symptoms = "Симптомы",
                send_form.Necessary_Medical_Measures = "Необходимые медицинские меры",
                send_form.just_some_medicines = "просто лекарства",
                send_form.need_Doctor_medical_measures = "нужны медицинские меры врача",
                send_form.Emergency_Room = "Отделение неотложной помощи",
                send_form.Searching_Priority = "Приоритет поиска",
                send_form.Near_Distance = "Близкое расстояние",
                send_form.Support_your_Language = "Поддержите свой язык",
                send_form.bot_translation =  "переведенное предложение";
                send_form.bot_hospital_name =  "название больницы";
                send_form.bot_hospital_addr =  "адрес больницы";
                send_form.bot_language =  "язык поддержки";
                send_form.bot_route =  "Рекомендуемый маршрут медицинского учреждения";
                send_form.bot_retry =  "Если это не та информация, которую вы хотите";
                send_form.send = "Отправить";
            break;
        case "kk" : 
                send_form.Symptoms = "Симптомдар",
                send_form.Necessary_Medical_Measures = "Қажетті медициналық шаралар",
                send_form.just_some_medicines = "тек кейбір дәрілер",
                send_form.need_Doctor_medical_measures = "Дәрігердің медициналық шаралары қажет",
                send_form.Emergency_Room = "Жедел жәрдем бөлмесі",
                send_form.Searching_Priority = "Іздеу басымдығы",
                send_form.Near_Distance = "Жақын қашықтық",
                send_form.Support_your_Language = "Тіліңізді қолдаңыз",
                send_form.bot_translation =  "аударылған сөйлем";
                send_form.bot_hospital_name =  "аурухана атауы";
                send_form.bot_hospital_addr =  "аурухананың мекенжайы";
                send_form.bot_language =  "қолдау тілі";
                send_form.bot_route =  "Медициналық мекеменің ұсынылатын бағыты";
                send_form.bot_retry =  "Егер бұл сізге қажет ақпарат болмаса";
                send_form.send = "жіберу";
            break;
        case "ja" : 
                send_form.Symptoms = "症状",
                send_form.Necessary_Medical_Measures = "必要な医療措置",
                send_form.just_some_medicines = "いくつかの薬",
                send_form.need_Doctor_medical_measures = "医師による治療が必要",
                send_form.Emergency_Room = "緊急治療室",
                send_form.Searching_Priority = "検索の優先度",
                send_form.Near_Distance = "近距離",
                send_form.Support_your_Language = "言語をサポートする",
                send_form.bot_translation =  "訳文";
                send_form.bot_hospital_name =  "病院名";
                send_form.bot_hospital_addr =  "病院の住所";
                send_form.bot_language =  "サポート言語";
                send_form.bot_route =  "おすすめの医療機関ルート";
                send_form.bot_retry =  "これがあなたが望む情報ではない場合";
                send_form.send = "送信";
            break;
    
        default:
            break;
    }

    
}


function change_form(){
    let $form = $('#msg');
    $form.children('textarea').attr('placeholder',send_form.Symptoms);
    $form.children('h3').eq(0).text(send_form.Necessary_Medical_Measures);
    
    $form.children('div').eq(0).children('label').eq(0).html(`${send_form.just_some_medicines} <input id="NMM1", required, type="radio", name="NMM", value="1">`)
    $form.children('div').eq(0).children('label').eq(1).html(`${send_form.need_Doctor_medical_measures} <input id="NMM2", required, type="radio", name="NMM", value="2">`)
    $form.children('div').eq(0).children('label').eq(2).html(`${send_form.Emergency_Room} <input id="NMM3", required, type="radio", name="NMM", value="3">`)

    $form.children('h3').eq(1).text(send_form.Searching_Priority);

    $form.children('div').eq(1).children('label').eq(0).html(`${send_form.Near_Distance} <input id="EL1", required, type="radio", name="EL", value="1">`)
    $form.children('div').eq(1).children('label').eq(1).html(`${send_form.Support_your_Language} <input id="EL2", required, type="radio", name="EL", value="2">`)

    $form.children('button').text(send_form.send)
}