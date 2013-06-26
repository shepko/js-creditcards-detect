function getCreditCardType (str, one) {
    var name,
        regexp,
        i,j,k,
        res   = [],
        min   = 13,
        len   = str.length,
        card,
        cards = {
            //American Express: 34, 37
            aa:      [/^(34|37)/, 15],
            //Discover: 6011, 622126 to 622925, 644, 645, 646, 647, 648, 649, 65
            dsvr:    [/^(62212[6-9]|6221[3-9][0-9]|622[2-8][0-9]|6229[3-9][0-9]|62292[1-5])|^(6011|644|645|646|647|648|649|65)/, 16],
            //InstaPayment: 637, 638, 639
            instp:   [/^63[7-9]/, 16],
            //JCB: 3528 to 3589
            jcb:     [/^35(2[8-9]|[3-8][0-9])/, 16],
            //Maestro: 5018, 5020, 5038, 5893, 6304, 6759, 6761, 6762, 6763
            maestro: [/^(5018|5020|5038|5893|6304|6759|6761|6762|6763)/, 16, 17, 18, 19],
            //Lacer: 6304, 6706, 6771, 6709
            laser:   [/^(6304|6706|6771|6709)/, 16, 17, 18, 19],
            //MasterCard: 51, 52, 53, 54, 55
            master:  [/^5[1-5]/, 16],
            //Diners Club - Carte Blanche: 300, 301, 302, 303, 304, 305
            dc_cb:   [/^30[0-5]/, 14],
            //Diners Club - International: 36
            dc_i:    [/^36/, 14],
            //Diners Club - USA & Canada: 54
            dc_uc:   [/^54/, 16],
            //Visa Electron: 4026, 417500, 4508, 4844, 4913, 4917
            visae:   [/^(4026|417500|4508|4844|4913|4917)/, 16],
            //Visa: 4
            visa:    [/^4/, 13, 16]
        };

    for (name in cards) {
        if (!cards.hasOwnProperty(name)) {
            continue;
        }

        card   = cards[name];
        regexp = card[0];

        if (regexp.test(str)) {
            //more accurate detection
            if (len >= min) {
                for (i = 1, j = cards[name].length; i < j; i++) {
                    k = card[i];

                    if (len <= card[1] || len == k) {
                        if (one) {
                            return name;
                        }

                        res.push(name);
                    }
                }
            } else if (one) {
                return name;
            }

            res.push(name);
        }
    }

    return res;
}

function isCardNumberValid (str) {
    /* The Luhn Formula:
     - Drop the last digit from the number. The last digit is what we want to check against
     - Reverse the numbers
     - Multiply the digits in odd positions (1, 3, 5, etc.) by 2 and subtract 9 to all any result higher than 9
     - Add all the numbers together
     - The check digit (the last number of the card) is the amount that you would need to add to get a multiple of 10 (Modulo 10)
     */
    var digits   = (''+str).split(''),
        sum      = digits.pop() * 1,
        digits   = digits.reverse(),
        i, j;

    for (i = 0, j = digits.length; i < j; i++) {

        if (0 == i%2) {
            digits[i] *= 2;

            if (digits[i] > 9) {
                digits[i] -= 9;
            }
        }

        sum += +digits[i];
    }

    return 0 == sum ? false : (0 == sum%10);
}
