// Модулі → колоди → картки.
// Картка: [питання, відповідь] у LaTeX. Текст усередині формули — через \text{...}.
// УВАГА: id картки = хеш тексту питання. Змінити текст питання = скинути прогрес учнів по цій картці.
const Q = '\\ ?';                       // знак питання в картці
const c = s => '\\quad\\small(' + s + ')';   // умова дрібним шрифтом
const tg = '\\operatorname{tg}', ctg = '\\operatorname{ctg}';
const T = s => '\\text{' + s + '}';   // звичайний текст у картці
const lines = (...xs) => '\\begin{gathered}' + xs.join('\\\\[2pt]') + '\\end{gathered}';   // кілька рядків
const note = (f, t) => '\\begin{gathered}' + f + '\\\\[2pt] \\small\\text{' + t + '}\\end{gathered}';   // пояснення під формулою

module.exports = [
  {
    id: 'mod1', title: 'Модуль 1 · База математики', sub: 'числа, подільність, ФСМ',
    decks: [
      {
        id: 'chysla', title: 'Дійсні числа', sub: 'числові множини, прості та складені',
        cards: [
          [T('Натуральні числа ') + '(\\mathbb N)', lines(T('числа, які використовують при лічбі'), '1;\\ 2;\\ 3;\\ 4;\\ \\ldots')],
          [T('Цілі числа ') + '(\\mathbb Z)', lines(T('натуральні, протилежні до них і нуль'), '\\ldots;\\ -2;\\ -1;\\ 0;\\ 1;\\ 2;\\ \\ldots')],
          [T('Раціональні числа ') + '(\\mathbb Q)', lines(T('числа, які можна записати дробом ') + '\\dfrac mn,', '\\text{де }m\\in\\mathbb Z,\\ n\\in\\mathbb N', '3{,}4;\\ \\ -0{,}1;\\ \\ \\dfrac35;\\ \\ 7')],
          [T('Ірраціональні числа ') + '(\\mathbb I)', lines(T('нескінченні неперіодичні'), T('десяткові дроби'), '\\sqrt5;\\ \\ \\pi;\\ \\ \\sin5^\\circ')],
          [T('Дійсні числа ') + '(\\mathbb R)', lines(T('раціональні та ірраціональні разом'), '\\mathbb R=\\mathbb Q\\cup\\mathbb I')],
          [T('Прості числа'), lines(T('мають два дільники'), T('(1 та саме число)'))],
          [T('Складені числа'), T('мають більше двох дільників')],
        ],
      },
      {
        id: 'podilnist', title: 'Ознаки подільності', sub: 'на 2, 3, 4, 5, 9, 10',
        cards: [
          [T('Ознака подільності на 2'), lines(T('число закінчується парною цифрою'), '(0,\\ 2,\\ 4,\\ 6,\\ 8)')],
          [T('Ознака подільності на 5'), T('число закінчується на 0 або 5')],
          [T('Ознака подільності на 10'), T('число закінчується на 0')],
          [T('Ознака подільності на 4'), lines(T('число закінчується на 00'), T('або число з двох останніх цифр'), T('ділиться на 4'))],
          [T('Ознака подільності на 3'), lines(T('сума цифр числа'), T('ділиться на 3'))],
          [T('Ознака подільності на 9'), lines(T('сума цифр числа'), T('ділиться на 9'))],
        ],
      },
      {
        id: 'fsm', title: 'Формули скороченого множення', sub: 'ФСМ',
        cards: [
          ['(a+b)^2=' + Q, 'a^2+2ab+b^2'],
          ['(a-b)^2=' + Q, 'a^2-2ab+b^2'],
          ['a^2-b^2=' + Q, '(a-b)(a+b)'],
          ['(a+b)^3=' + Q, 'a^3+3a^2b+3ab^2+b^3'],
          ['(a-b)^3=' + Q, 'a^3-3a^2b+3ab^2-b^3'],
          ['a^3+b^3=' + Q, '(a+b)(a^2-ab+b^2)'],
          ['a^3-b^3=' + Q, '(a-b)(a^2+ab+b^2)'],
        ],
      },
    ],
  },
  {
    id: 'mod2', title: 'Модуль 2 · Вирази', sub: 'степені, многочлени, корені, логарифми',
    related: ['fsm'],   // «Знадобиться з попередніх модулів»
    decks: [
      {
        id: 'stepeni', title: 'Степеневі вирази', sub: 'властивості степеня',
        cards: [
          ['a^1=' + Q, 'a'],
          ['a^m\\cdot a^n=' + Q, 'a^{m+n}'],
          ['a^m:a^n=' + Q, 'a^{m-n}'],
          ['(a^m)^n=' + Q, 'a^{mn}'],
          ['(a\\cdot b)^n=' + Q, 'a^n\\cdot b^n'],
          ['\\left(\\dfrac ab\\right)^n=' + Q, '\\dfrac{a^n}{b^n}'],
          ['a^0=' + Q, '1'],
          ['0^0=' + Q, '\\text{не має змісту}'],
          ['a^{-n}=' + Q, '\\dfrac{1}{a^n}'],
          ['\\left(\\dfrac ab\\right)^{-n}=' + Q, '\\left(\\dfrac ba\\right)^{n}'],
          ['\\begin{gathered}\\text{Стандартний вигляд}\\\\ \\text{додатного числа:}\\\\ a\\cdot10^n,\\ \\text{де}' + Q + '\\end{gathered}', '\\begin{gathered}1\\le a<10,\\\\ n\\ \\text{— ціле число}\\end{gathered}'],
        ],
      },
      {
        id: 'racionalni', title: 'Раціональні вирази', sub: 'дужки, многочлени, розклад на множники',
        cards: [
          ['+(a-b+c)=' + Q, note('a-b+c', 'прибираємо дужки, нічого не змінюємо')],
          ['-(a-b+c)=' + Q, note('-a+b-c', 'знаки всіх доданків — на протилежні')],
          ['a(b+c-d)=' + Q, note('ab+ac-ad', 'множимо на кожен доданок')],
          ['(a+b)(c+d)=' + Q, note('ac+ad+bc+bd', 'кожен доданок на кожен')],
          [note('ab+ac=' + Q, 'винеси спільний множник'), 'a(b+c)'],
          [note('ax+ay+bx+by=' + Q, 'розклади групуванням'), '\\begin{gathered}a(x+y)+b(x+y)=\\\\(x+y)(a+b)\\end{gathered}'],
        ],
      },
      {
        id: 'irracionalni', title: 'Ірраціональні вирази', sub: 'властивості коренів',
        cards: [
          ['\\sqrt[n]{0}=' + Q, '0'],
          ['\\sqrt[n]{1}=' + Q, '1'],
          ['\\sqrt[n]{ab}=' + Q, '\\sqrt[n]{a}\\cdot\\sqrt[n]{b}'],
          ['\\sqrt[n]{\\dfrac ab}=' + Q, '\\dfrac{\\sqrt[n]{a}}{\\sqrt[n]{b}}'],
          ['\\left(\\sqrt[n]{a}\\right)^n=' + Q, 'a'],
          ['\\sqrt[n]{a^n}=' + Q + c('n\\ \\text{— непарне}'), 'a'],
          ['\\sqrt[n]{a^n}=' + Q + c('n\\ \\text{— парне}'), '|a|'],
          ['\\sqrt[k]{\\sqrt[n]{a}}=' + Q, '\\sqrt[k\\cdot n]{a}'],
          ['\\sqrt[k\\cdot n]{a^k}=' + Q, '\\sqrt[n]{a}'],
          ['a\\sqrt[n]{b}=' + Q + c('\\text{внеси під корінь}'), '\\sqrt[n]{b\\cdot a^n}'],
          ['\\sqrt[n]{a^m}=' + Q + c('\\text{як степінь}'), 'a^{\\frac mn}'],
          ['\\dfrac{a}{\\sqrt b}=' + Q + c('\\text{позбудься кореня в знаменнику}'), '\\dfrac{a\\cdot\\sqrt b}{\\sqrt b\\cdot\\sqrt b}=\\dfrac{a\\sqrt b}{b}'],
          ['\\text{Спряжений вираз до } a+\\sqrt b', 'a-\\sqrt b'],
          ['\\dfrac{a}{a+\\sqrt b}=' + Q + c('\\text{позбудься кореня в знаменнику}'), '\\dfrac{a\\cdot(a-\\sqrt b)}{(a+\\sqrt b)\\cdot(a-\\sqrt b)}=\\dfrac{a(a-\\sqrt b)}{a^2-b}'],
        ],
      },
      {
        id: 'logaryfmy', title: 'Логарифмічні вирази', sub: 'властивості логарифма',
        cards: [
          ['\\log_a 1=' + Q, '0'],
          ['\\log_a a=' + Q, '1'],
          ['\\log_a(bc)=' + Q, '\\log_a b+\\log_a c'],
          ['\\log_a\\left(\\dfrac bc\\right)=' + Q, '\\log_a b-\\log_a c'],
          ['\\log_a b^n=' + Q, 'n\\cdot\\log_a b'],
          ['\\log_{a^n} b=' + Q, '\\dfrac1n\\log_a b'],
          ['a^{\\log_a b}=' + Q, 'b'],
          ['\\log_a b=' + Q + c('\\text{через } \\log_b a'), '\\dfrac{1}{\\log_b a}'],
          ['\\log_a b=' + Q + c('\\text{перехід до основи } c'), '\\dfrac{\\log_c b}{\\log_c a}'],
        ],
      },
    ],
  },
  {
    id: 'mod6', title: 'Модуль 6 · Тригонометрія', sub: 'тригонометричні вирази',
    decks: [
      {
        id: 'tryg-vyrazy', title: 'Тригонометричні вирази', sub: 'тотожності, формули суми й різниці, подвійного аргументу',
        cards: [
          ['\\sin^2\\alpha+\\cos^2\\alpha=' + Q, '1'],
          ['\\sin^2\\alpha=' + Q + c('\\text{через } \\cos'), '1-\\cos^2\\alpha'],
          ['\\cos^2\\alpha=' + Q + c('\\text{через } \\sin'), '1-\\sin^2\\alpha'],
          [tg + '\\alpha=' + Q + c('\\text{через } \\sin \\text{ і } \\cos'), '\\dfrac{\\sin\\alpha}{\\cos\\alpha}'],
          [ctg + '\\alpha=' + Q + c('\\text{через } \\sin \\text{ і } \\cos'), '\\dfrac{\\cos\\alpha}{\\sin\\alpha}'],
          [tg + '\\alpha\\cdot' + ctg + '\\alpha=' + Q, '1'],
          [ctg + '\\alpha=' + Q + c('\\text{через } ' + tg), '\\dfrac{1}{' + tg + '\\alpha}'],
          [tg + '\\alpha=' + Q + c('\\text{через } ' + ctg), '\\dfrac{1}{' + ctg + '\\alpha}'],
          ['1+' + tg + '^2\\alpha=' + Q, '\\dfrac{1}{\\cos^2\\alpha}'],
          ['1+' + ctg + '^2\\alpha=' + Q, '\\dfrac{1}{\\sin^2\\alpha}'],
          ['\\cos(\\alpha-\\beta)=' + Q, '\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta'],
          ['\\cos(\\alpha+\\beta)=' + Q, '\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta'],
          ['\\sin(\\alpha-\\beta)=' + Q, '\\sin\\alpha\\cos\\beta-\\sin\\beta\\cos\\alpha'],
          ['\\sin(\\alpha+\\beta)=' + Q, '\\sin\\alpha\\cos\\beta+\\sin\\beta\\cos\\alpha'],
          [tg + '(\\alpha+\\beta)=' + Q, '\\dfrac{' + tg + '\\alpha+' + tg + '\\beta}{1-' + tg + '\\alpha\\cdot' + tg + '\\beta}'],
          [tg + '(\\alpha-\\beta)=' + Q, '\\dfrac{' + tg + '\\alpha-' + tg + '\\beta}{1+' + tg + '\\alpha\\cdot' + tg + '\\beta}'],
          ['\\sin2\\alpha=' + Q, '2\\sin\\alpha\\cos\\alpha'],
          ['\\cos2\\alpha=' + Q, '\\cos^2\\alpha-\\sin^2\\alpha'],
          [tg + '2\\alpha=' + Q, '\\dfrac{2' + tg + '\\alpha}{1-' + tg + '^2\\alpha}'],
        ],
      },
    ],
  },
  {
    id: 'odz-all', title: 'ОДЗ', sub: 'де вираз має зміст · для всіх тем',
    decks: [
      {
        id: 'odz', draft: true, title: 'ОДЗ', sub: 'де вираз має зміст',
        cards: [
          ['\\text{ОДЗ: }\\dfrac AB', 'B\\ne0'],
          ['\\text{ОДЗ: }\\sqrt{A}\\ \\ \\small(\\text{і будь-який корінь парного степеня})', 'A\\ge0'],
          ['\\text{ОДЗ: }\\sqrt[3]{A}\\ \\ \\small(\\text{і будь-який корінь непарного степеня})', 'A\\ \\text{— будь-яке}'],
          ['\\text{ОДЗ: }\\dfrac{A}{\\sqrt B}', 'B>0'],
          ['\\text{ОДЗ: }A^0', 'A\\ne0'],
          ['\\text{ОДЗ: }A^{-n}', 'A\\ne0'],
          ['\\text{ОДЗ: }A^{\\frac mn}\\ \\ \\small(\\tfrac mn>0)', 'A\\ge0'],
          ['\\text{ОДЗ: }A^{-\\frac mn}\\ \\ \\small(\\tfrac mn>0)', 'A>0'],
          ['\\text{Основа показникової функції: } y=a^x', 'a>0,\\ a\\ne1'],
          ['\\text{ОДЗ: }\\log_a A', 'A>0'],
          ['\\text{ОДЗ: }\\log_A b\\ \\ \\small(\\text{змінна в основі})', 'A>0,\\ A\\ne1'],
          ['\\dfrac AB=0\\ \\Leftrightarrow' + Q, 'A=0,\\ B\\ne0'],
        ],
      },
    ],
  },
];
