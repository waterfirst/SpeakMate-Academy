function lesson(text, hint, keywords, expected, sampleAnswer, drill) {
  return { text, hint, keywords, expected, sampleAnswer, drill };
}

window.SPEAKMATE_SCENES = {
  cafe: {
    label: "카페 주문",
    badge: "Cafe",
    prompts: [
      lesson(
        "Good afternoon. What would you like to order today?",
        "힌트: 원하는 음료, 사이즈, 추가 요청을 한 문장으로 말해보세요.",
        ["coffee", "latte", "tea", "americano", "cappuccino", "size", "large", "small", "medium", "iced", "hot", "order", "please"],
        ["drink", "size", "polite request"],
        "I would like a large iced latte, please.",
        "같은 주문을 더 공손하게 말해보세요: Could I get a large iced latte, please?"
      ),
      lesson(
        "Would you like that hot or iced?",
        "힌트: hot, iced, less sweet, no syrup 같은 표현을 붙여보세요.",
        ["hot", "iced", "cold", "warm", "less sweet", "syrup", "ice"],
        ["temperature", "preference"],
        "I would like it iced and less sweet, please.",
        "추가 요청을 붙여보세요: with less ice, no syrup, or extra shot."
      ),
      lesson(
        "Can I get your name for the order?",
        "힌트: 이름을 말하고 철자를 천천히 설명해보세요.",
        ["name", "my name", "spell", "it is", "call me"],
        ["name", "spelling"],
        "My name is Jiyoon. It is spelled J-I-Y-O-O-N.",
        "자기 이름을 철자까지 포함해서 2번 말해보세요."
      ),
      lesson(
        "Would you like anything else with your drink?",
        "힌트: 디저트나 추가 주문이 있는지 말해보세요.",
        ["anything else", "cake", "sandwich", "cookie", "muffin", "nothing", "that's all"],
        ["extra item", "clear answer"],
        "No, thank you. That will be all.",
        "추가 주문이 있는 버전과 없는 버전을 각각 연습하세요."
      ),
      lesson(
        "For here or to go?",
        "힌트: 매장에서 마실지 가져갈지 간단히 답하세요.",
        ["for here", "to go", "takeaway", "stay", "drink here"],
        ["dining option"],
        "To go, please.",
        "For here와 to go를 각각 사용해서 답변하세요."
      ),
      lesson(
        "Do you want regular milk or oat milk?",
        "힌트: 우유 종류와 이유를 짧게 말해보세요.",
        ["regular milk", "oat milk", "soy milk", "almond milk", "dairy", "lactose"],
        ["milk choice", "reason"],
        "Oat milk, please. I prefer non-dairy milk.",
        "선택 이유를 because로 붙여보세요."
      ),
      lesson(
        "How would you like to pay?",
        "힌트: 카드, 현금, 모바일 결제를 말해보세요.",
        ["card", "cash", "mobile", "pay", "credit card", "apple pay"],
        ["payment method"],
        "I will pay by credit card.",
        "cash, card, mobile pay 세 가지 방식으로 답해보세요."
      ),
      lesson(
        "Your drink will be ready in five minutes. Is that okay?",
        "힌트: 기다릴 수 있는지 자연스럽게 답하세요.",
        ["okay", "fine", "wait", "minutes", "no problem", "in a hurry"],
        ["time response"],
        "That is fine. I can wait for five minutes.",
        "기다릴 수 없는 상황도 만들어 말해보세요."
      ),
      lesson(
        "Would you like a receipt?",
        "힌트: 영수증 필요 여부를 말하세요.",
        ["receipt", "yes", "no", "email", "paper"],
        ["receipt choice"],
        "No, thank you. I do not need a receipt.",
        "종이 영수증과 이메일 영수증을 각각 요청해보세요."
      ),
      lesson(
        "There is no more vanilla syrup. Would caramel be okay?",
        "힌트: 대체 옵션을 받아들이거나 다른 요청을 하세요.",
        ["vanilla", "caramel", "okay", "instead", "another", "without syrup"],
        ["alternative", "preference"],
        "Caramel is okay. Thank you for letting me know.",
        "대체 옵션을 거절하고 다른 선택을 요청해보세요."
      ),
    ],
  },
  airport: {
    label: "공항 입국",
    badge: "Airport",
    prompts: [
      lesson(
        "What is the purpose of your visit?",
        "힌트: business, vacation, conference 같은 목적을 짧게 말해보세요.",
        ["business", "vacation", "travel", "conference", "meeting", "study", "visit", "tourism"],
        ["purpose"],
        "I am here for a business meeting.",
        "business, vacation, study를 각각 사용해 답하세요."
      ),
      lesson(
        "How long will you be staying?",
        "힌트: 기간과 머무는 도시를 함께 말하면 자연스럽습니다.",
        ["day", "days", "week", "weeks", "month", "staying", "stay", "long"],
        ["duration"],
        "I will be staying for five days.",
        "3 days, 2 weeks, 1 month로 바꿔 말해보세요."
      ),
      lesson(
        "Where will you be staying during your trip?",
        "힌트: hotel, friend's house, company apartment 등으로 답해보세요.",
        ["hotel", "house", "apartment", "friend", "company", "staying", "address"],
        ["place"],
        "I will be staying at the Green Hotel in downtown Seattle.",
        "호텔 이름과 도시를 바꿔 다시 말하세요."
      ),
      lesson(
        "Do you have a return ticket?",
        "힌트: 귀국 항공권 여부와 날짜를 말하세요.",
        ["return ticket", "ticket", "flight", "back", "return", "date"],
        ["return plan"],
        "Yes, I have a return ticket for next Friday.",
        "귀국 날짜를 tomorrow, next Monday, in two weeks로 바꿔보세요."
      ),
      lesson(
        "Are you traveling alone or with someone?",
        "힌트: 혼자인지 동행이 있는지 말하세요.",
        ["alone", "with", "family", "friend", "colleague", "coworker"],
        ["travel party"],
        "I am traveling with my colleague.",
        "alone, with my family, with my friend로 답해보세요."
      ),
      lesson(
        "Do you have anything to declare?",
        "힌트: 신고할 물품이 있는지 간단히 답하세요.",
        ["declare", "nothing", "goods", "food", "cash", "items"],
        ["customs answer"],
        "No, I do not have anything to declare.",
        "신고할 물품이 있는 상황도 만들어 말하세요."
      ),
      lesson(
        "What do you do for work?",
        "힌트: 직업을 한 문장으로 설명하세요.",
        ["work", "job", "teacher", "manager", "engineer", "student", "run"],
        ["occupation"],
        "I run an English academy in Korea.",
        "직업 + 담당 업무를 한 문장 더 붙여보세요."
      ),
      lesson(
        "Have you visited this country before?",
        "힌트: 이전 방문 여부와 시기를 말하세요.",
        ["visited", "before", "first time", "last year", "twice", "never"],
        ["visit history"],
        "No, this is my first time visiting this country.",
        "Yes로 시작하는 답변도 만들어보세요."
      ),
      lesson(
        "Can you show me your hotel reservation?",
        "힌트: 예약 확인서를 보여주겠다고 말하세요.",
        ["reservation", "hotel", "show", "confirmation", "here", "phone"],
        ["document response"],
        "Yes, here is my hotel reservation on my phone.",
        "printed copy와 email confirmation으로 바꿔보세요."
      ),
      lesson(
        "What cities will you visit during your stay?",
        "힌트: 방문 도시를 2개 이상 말하세요.",
        ["city", "cities", "visit", "seoul", "new york", "los angeles", "during"],
        ["cities", "itinerary"],
        "I will visit New York and Boston during my stay.",
        "도시 이름 2개와 방문 이유를 덧붙이세요."
      ),
    ],
  },
  meeting: {
    label: "업무 미팅",
    badge: "Meeting",
    prompts: [
      lesson(
        "Could you give us a quick update on your project?",
        "힌트: 진행 상황, 막힌 점, 다음 액션을 한 문단으로 말해보세요.",
        ["project", "progress", "done", "working", "issue", "next", "deadline", "update"],
        ["progress", "next action"],
        "The project is on track. We finished the first draft and will review it tomorrow.",
        "finished, working on, next step을 모두 넣어 답하세요."
      ),
      lesson(
        "What support do you need from the team?",
        "힌트: need help with, could you review, by Friday 같은 표현을 써보세요.",
        ["need", "help", "support", "review", "feedback", "team", "by", "Friday"],
        ["request", "deadline"],
        "I need feedback on the proposal by Friday.",
        "help with, review, confirm을 각각 사용하세요."
      ),
      lesson(
        "Can you summarize the decision in one sentence?",
        "힌트: We decided to... 구조를 사용해보세요.",
        ["decided", "decision", "agree", "plan", "next", "will"],
        ["summary"],
        "We decided to launch the pilot program next month.",
        "decision + timeline 구조로 다시 답하세요."
      ),
      lesson(
        "What is the main risk we should watch?",
        "힌트: risk, delay, budget, quality 같은 단어를 사용하세요.",
        ["risk", "delay", "budget", "quality", "schedule", "watch"],
        ["risk", "reason"],
        "The main risk is a schedule delay because the design review is not finished.",
        "risk + because + action 구조로 말하세요."
      ),
      lesson(
        "Who is responsible for the next action item?",
        "힌트: 담당자와 업무를 분명히 말하세요.",
        ["responsible", "owner", "next action", "will", "task", "item"],
        ["owner", "task"],
        "I am responsible for preparing the next report.",
        "동료 이름을 넣어 담당 업무를 말하세요."
      ),
      lesson(
        "When can you send the revised document?",
        "힌트: 보낼 날짜와 시간을 말하세요.",
        ["send", "revised", "document", "by", "tomorrow", "Friday", "morning"],
        ["deadline"],
        "I can send the revised document by tomorrow morning.",
        "by Friday afternoon, by noon, by next week로 바꿔보세요."
      ),
      lesson(
        "Do you agree with this proposal?",
        "힌트: 동의 여부와 이유를 말하세요.",
        ["agree", "proposal", "yes", "no", "because", "concern"],
        ["opinion", "reason"],
        "I agree with the proposal because it is realistic and cost-effective.",
        "I partly agree로 시작하는 답변을 만들어보세요."
      ),
      lesson(
        "Can you clarify your point?",
        "힌트: Let me clarify... 로 다시 설명하세요.",
        ["clarify", "mean", "point", "explain", "example"],
        ["clarification"],
        "Let me clarify my point. I mean we should test the feature with a small group first.",
        "I mean...과 For example...을 모두 사용하세요."
      ),
      lesson(
        "What is our next milestone?",
        "힌트: 다음 마일스톤과 날짜를 말하세요.",
        ["milestone", "next", "deadline", "launch", "review", "complete"],
        ["milestone", "date"],
        "Our next milestone is the beta launch on July 15.",
        "milestone + exact date 구조로 말하세요."
      ),
      lesson(
        "Could you follow up with the client?",
        "힌트: follow up, send, confirm 표현을 사용하세요.",
        ["follow up", "client", "send", "confirm", "email", "call"],
        ["follow-up action"],
        "Yes, I will follow up with the client and confirm the schedule.",
        "이메일로 할지 전화로 할지 구체화하세요."
      ),
    ],
  },
  travel: {
    label: "여행 길찾기",
    badge: "Travel",
    prompts: [
      lesson(
        "Where would you like to go?",
        "힌트: 장소 이름과 transportation을 함께 말해보세요.",
        ["go", "station", "museum", "hotel", "airport", "restaurant", "bus", "subway", "taxi"],
        ["destination"],
        "I would like to go to the city museum by subway.",
        "장소와 이동 수단을 바꿔 3번 답하세요."
      ),
      lesson(
        "Do you prefer the fastest route or the cheapest route?",
        "힌트: prefer, faster, cheaper, transfer 같은 단어를 연습하세요.",
        ["prefer", "fastest", "cheapest", "faster", "cheap", "route", "transfer"],
        ["preference"],
        "I prefer the fastest route, even if it costs a little more.",
        "cheapest route를 선호하는 답변도 만들어보세요."
      ),
      lesson(
        "Would you like me to show you the route on the map?",
        "힌트: Yes, please. Could you also...로 추가 요청을 말해보세요.",
        ["yes", "please", "map", "route", "show", "could you", "also"],
        ["confirmation", "extra request"],
        "Yes, please. Could you also show me the nearest subway station?",
        "also 뒤에 다른 요청을 붙이세요."
      ),
      lesson(
        "How far is it from here?",
        "힌트: 거리나 시간을 물어보세요.",
        ["far", "from here", "minutes", "walk", "drive", "kilometers"],
        ["distance"],
        "How far is it from here, and how long does it take by bus?",
        "walking, taxi, subway로 바꿔 질문하세요."
      ),
      lesson(
        "Do you need a taxi or public transportation?",
        "힌트: taxi, bus, subway 중 선택하고 이유를 말하세요.",
        ["taxi", "public transportation", "bus", "subway", "need", "prefer"],
        ["transport choice", "reason"],
        "I prefer public transportation because it is cheaper.",
        "taxi를 선택하는 이유도 만들어보세요."
      ),
      lesson(
        "Which stop should I get off at?",
        "힌트: get off at 표현을 사용해보세요.",
        ["stop", "get off", "station", "which", "line"],
        ["stop question"],
        "Which stop should I get off at for the museum?",
        "museum을 hotel, airport, restaurant로 바꾸세요."
      ),
      lesson(
        "Is there a transfer on this route?",
        "힌트: transfer가 있는지 묻고 확인하세요.",
        ["transfer", "route", "line", "change", "direct"],
        ["transfer question"],
        "Is there a transfer on this route, or is it direct?",
        "direct route를 요청하는 문장을 만들어보세요."
      ),
      lesson(
        "Can I buy a ticket here?",
        "힌트: ticket, machine, counter를 사용하세요.",
        ["ticket", "buy", "machine", "counter", "here", "card"],
        ["ticket purchase"],
        "Can I buy a subway ticket here with my credit card?",
        "현금 결제와 카드 결제 버전을 연습하세요."
      ),
      lesson(
        "What time is the last train?",
        "힌트: last train/bus와 시간을 물어보세요.",
        ["last train", "last bus", "time", "tonight", "leave"],
        ["schedule question"],
        "What time is the last train tonight?",
        "train을 bus, ferry, airport shuttle로 바꾸세요."
      ),
      lesson(
        "I think I am lost. Can you help me?",
        "힌트: 길을 잃었고 도움을 요청한다고 말하세요.",
        ["lost", "help", "find", "way", "map", "please"],
        ["help request"],
        "I think I am lost. Could you help me find this hotel?",
        "호텔 주소를 보여주는 상황으로 한 문장 더 붙이세요."
      ),
    ],
  },
  shopping: {
    label: "쇼핑/환불",
    badge: "Shopping",
    prompts: [
      lesson(
        "What size are you looking for?",
        "힌트: 원하는 사이즈와 색상을 함께 말하세요.",
        ["size", "small", "medium", "large", "color", "looking for"],
        ["size", "color"],
        "I am looking for a medium size in black.",
        "size와 color를 바꿔 3번 말하세요."
      ),
      lesson(
        "Would you like to try it on?",
        "힌트: 입어보고 싶다고 말하세요.",
        ["try it on", "fitting room", "yes", "please", "size"],
        ["try-on request"],
        "Yes, please. Where is the fitting room?",
        "fitting room 위치를 묻는 문장을 연습하세요."
      ),
      lesson(
        "How does it fit?",
        "힌트: too small, too big, just right를 사용하세요.",
        ["fit", "small", "big", "tight", "loose", "right"],
        ["fit feedback"],
        "It is a little too tight. Do you have a larger size?",
        "too big, too loose, just right로 바꿔보세요."
      ),
      lesson(
        "Are you looking for anything specific?",
        "힌트: 찾는 물건과 목적을 말하세요.",
        ["looking for", "specific", "gift", "shirt", "shoes", "bag"],
        ["item", "purpose"],
        "I am looking for a gift for my friend.",
        "gift 대신 work, travel, daily use로 바꿔보세요."
      ),
      lesson(
        "This item is on sale. Would you like to buy it?",
        "힌트: 할인 여부와 구매 결정을 말하세요.",
        ["sale", "discount", "buy", "price", "take it"],
        ["purchase decision"],
        "Yes, I will take it if the discount is included.",
        "구매하지 않는 이유도 말해보세요."
      ),
      lesson(
        "How would you like to pay?",
        "힌트: 결제 방법을 말하세요.",
        ["pay", "card", "cash", "installment", "mobile"],
        ["payment method"],
        "I would like to pay by card.",
        "cash와 mobile payment로 바꿔보세요."
      ),
      lesson(
        "Do you need a shopping bag?",
        "힌트: 쇼핑백 필요 여부를 말하세요.",
        ["shopping bag", "bag", "need", "yes", "no", "bring"],
        ["bag choice"],
        "No, thank you. I brought my own bag.",
        "유료 쇼핑백을 요청하는 문장도 말하세요."
      ),
      lesson(
        "Can I help you return this item?",
        "힌트: 반품 이유를 설명하세요.",
        ["return", "refund", "exchange", "wrong size", "defective", "receipt"],
        ["return reason"],
        "I would like to return this item because it is the wrong size.",
        "exchange와 refund를 각각 사용하세요."
      ),
      lesson(
        "Do you have the receipt?",
        "힌트: 영수증이 있는지 말하세요.",
        ["receipt", "have", "email", "paper", "lost"],
        ["receipt status"],
        "Yes, I have the receipt in my email.",
        "영수증이 없는 상황도 말해보세요."
      ),
      lesson(
        "Would you prefer a refund or an exchange?",
        "힌트: 환불 또는 교환 중 하나를 선택하세요.",
        ["refund", "exchange", "prefer", "same item", "different size"],
        ["refund choice"],
        "I would prefer an exchange for a different size.",
        "refund를 선택하는 답변도 만들어보세요."
      ),
    ],
  },
  clinic: {
    label: "병원/약국",
    badge: "Clinic",
    prompts: [
      lesson(
        "What symptoms do you have?",
        "힌트: 증상과 시작 시점을 말하세요.",
        ["symptom", "fever", "cough", "headache", "pain", "started"],
        ["symptom", "time"],
        "I have a headache and a fever. It started yesterday.",
        "증상 2개와 시작 시점을 바꿔 말하세요."
      ),
      lesson(
        "How long have you had this problem?",
        "힌트: for two days, since Monday를 사용하세요.",
        ["long", "problem", "days", "since", "week", "started"],
        ["duration"],
        "I have had this problem for two days.",
        "for와 since를 각각 사용해보세요."
      ),
      lesson(
        "Are you taking any medication?",
        "힌트: 복용 중인 약이 있는지 말하세요.",
        ["medication", "medicine", "taking", "pill", "none"],
        ["medication status"],
        "No, I am not taking any medication right now.",
        "복용 중인 약이 있는 상황도 만들어보세요."
      ),
      lesson(
        "Do you have any allergies?",
        "힌트: 알레르기 여부를 말하세요.",
        ["allergy", "allergies", "penicillin", "food", "none"],
        ["allergy status"],
        "I do not have any allergies that I know of.",
        "약물 알레르기가 있는 답변도 연습하세요."
      ),
      lesson(
        "Where does it hurt?",
        "힌트: 아픈 부위와 강도를 말하세요.",
        ["hurt", "pain", "stomach", "head", "back", "throat"],
        ["body part", "pain level"],
        "My throat hurts, and the pain is mild.",
        "mild, moderate, severe를 각각 사용하세요."
      ),
      lesson(
        "Do you have insurance?",
        "힌트: 보험 여부와 카드가 있는지 말하세요.",
        ["insurance", "card", "have", "travel insurance"],
        ["insurance status"],
        "Yes, I have travel insurance. Here is my insurance card.",
        "보험이 없는 상황도 말해보세요."
      ),
      lesson(
        "Have you seen a doctor about this before?",
        "힌트: 이전 진료 여부를 말하세요.",
        ["doctor", "seen", "before", "clinic", "first time"],
        ["medical history"],
        "No, this is the first time I have seen a doctor about this.",
        "이미 진료받은 상황도 만들어보세요."
      ),
      lesson(
        "Please take this medicine twice a day.",
        "힌트: 복용 방법을 확인하는 질문을 하세요.",
        ["medicine", "twice", "day", "take", "after meals", "before meals"],
        ["dosage confirmation"],
        "Should I take this medicine twice a day after meals?",
        "하루 3번, 식전/식후로 바꿔 질문하세요."
      ),
      lesson(
        "Do you need a medical certificate?",
        "힌트: 진단서 필요 여부와 이유를 말하세요.",
        ["medical certificate", "need", "work", "school", "insurance"],
        ["certificate request"],
        "Yes, I need a medical certificate for my insurance claim.",
        "work와 school을 이유로 바꿔보세요."
      ),
      lesson(
        "Would you like to make a follow-up appointment?",
        "힌트: 재진 예약 여부와 날짜를 말하세요.",
        ["follow-up", "appointment", "next week", "schedule", "make"],
        ["appointment request"],
        "Yes, I would like to make a follow-up appointment next week.",
        "가능한 요일과 시간을 덧붙이세요."
      ),
    ],
  },
};
