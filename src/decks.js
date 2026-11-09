// Модулі → колоди → картки.
// Картка: [питання, відповідь] у LaTeX. Текст усередині формули — через \text{...}.
// УВАГА: id картки = хеш тексту питання. Змінити текст питання = скинути прогрес учнів по цій картці.
const Q = '\\ ?';                       // знак питання в картці
const c = s => '\\quad\\small(' + s + ')';   // умова дрібним шрифтом

module.exports = [
  {
    id: 'mod2', title: 'Модуль 2 · Вирази', sub: 'степені, дроби, корені, логарифми',
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
        id: 'racionalni', draft: true, title: 'Раціональні вирази', sub: 'ФСМ, розклад, дії з дробами',
        cards: [
          ['(a+b)^2=' + Q, 'a^2+2ab+b^2'],
          ['(a-b)^2=' + Q, 'a^2-2ab+b^2'],
          ['a^2-b^2=' + Q, '(a-b)(a+b)'],
          ['(a+b)^3=' + Q, 'a^3+3a^2b+3ab^2+b^3'],
          ['(a-b)^3=' + Q, 'a^3-3a^2b+3ab^2-b^3'],
          ['a^3+b^3=' + Q, '(a+b)(a^2-ab+b^2)'],
          ['a^3-b^3=' + Q, '(a-b)(a^2+ab+b^2)'],
          ['ax^2+bx+c=' + Q + c('x_1,\\ x_2\\ \\text{— корені}'), 'a(x-x_1)(x-x_2)'],
          ['\\dfrac{ac}{bc}=' + Q + c('c\\ne0'), '\\dfrac ab'],
          ['\\dfrac{a-b}{b-a}=' + Q, '-1'],
          ['\\dfrac ab+\\dfrac cd=' + Q, '\\dfrac{ad+bc}{bd}'],
          ['\\dfrac ab\\cdot\\dfrac cd=' + Q, '\\dfrac{ac}{bd}'],
          ['\\dfrac ab:\\dfrac cd=' + Q, '\\dfrac ab\\cdot\\dfrac dc=\\dfrac{ad}{bc}'],
        ],
      },
      {
        id: 'irracionalni', draft: true, title: 'Ірраціональні вирази', sub: 'властивості коренів',
        cards: [
          ['\\left(\\sqrt a\\right)^2=' + Q + c('a\\ge0'), 'a'],
          ['\\sqrt{a^2}=' + Q, '|a|'],
          ['\\sqrt[n]{a^n}=' + Q + c('n\\ \\text{парне}'), '|a|'],
          ['\\sqrt[n]{a^n}=' + Q + c('n\\ \\text{непарне}'), 'a'],
          ['\\sqrt{ab}=' + Q + c('a\\ge0,\\ b\\ge0'), '\\sqrt a\\cdot\\sqrt b'],
          ['\\sqrt{\\dfrac ab}=' + Q + c('a\\ge0,\\ b>0'), '\\dfrac{\\sqrt a}{\\sqrt b}'],
          ['\\left(\\sqrt[n]{a}\\right)^k=' + Q + c('a\\ge0'), '\\sqrt[n]{a^k}'],
          ['\\sqrt[n]{\\sqrt[k]{a}}=' + Q + c('a\\ge0'), '\\sqrt[nk]{a}'],
          ['\\sqrt[nk]{a^{mk}}=' + Q + c('a\\ge0'), '\\sqrt[n]{a^m}'],
          ['\\sqrt[3]{-a}=' + Q, '-\\sqrt[3]{a}'],
          ['\\sqrt{a^2b}=' + Q + c('b\\ge0'), '|a|\\sqrt b\\quad\\small(\\text{винесення з-під кореня})'],
          ['a\\sqrt b=' + Q + c('a\\ge0,\\ b\\ge0'), '\\sqrt{a^2b}\\quad\\small(\\text{внесення під корінь})'],
          ['\\dfrac{1}{\\sqrt a}=' + Q + c('a>0'), '\\dfrac{\\sqrt a}{a}'],
          ['\\dfrac{1}{\\sqrt a-\\sqrt b}=' + Q + c('a\\ne b'), '\\dfrac{\\sqrt a+\\sqrt b}{a-b}'],
        ],
      },
      {
        id: 'logaryfmy', draft: true, title: 'Логарифмічні вирази', sub: 'означення та властивості',
        cards: [
          ['\\log_a b=x\\ \\Leftrightarrow' + Q, 'a^x=b'],
          ['a^{\\log_a b}=' + Q, 'b'],
          ['\\log_a a=' + Q, '1'],
          ['\\log_a 1=' + Q, '0'],
          ['\\log_a a^p=' + Q, 'p'],
          ['\\log_a x+\\log_a y=' + Q, '\\log_a xy'],
          ['\\log_a x-\\log_a y=' + Q, '\\log_a\\dfrac xy'],
          ['\\log_a b^p=' + Q, 'p\\log_a b'],
          ['\\log_{a^k} b=' + Q, '\\dfrac1k\\log_a b'],
          ['\\log_a b=' + Q + c('\\text{перехід до основи } c'), '\\dfrac{\\log_c b}{\\log_c a}'],
          ['\\log_a b=' + Q + c('\\text{через } \\log_b a'), '\\dfrac{1}{\\log_b a}'],
          ['\\lg b=' + Q, '\\log_{10} b'],
          ['\\ln b=' + Q, '\\log_{e} b,\\quad e\\approx2{,}7'],
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
