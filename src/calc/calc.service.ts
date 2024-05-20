import { BadRequestException, Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  // this function will convert infix expression to postfix expression
  infixToPostfix(infix: string): string {
    // sets the precedence of operators
      const precedence = {
          '+': 1,
          '-': 1,
          '*': 2,
          '/': 2
      };

      const stack = [];
      let postfix = ''; // will store the postfix expression

      for (let i = 0; i < infix.length; i++) {
          const char = infix[i];

          if (/[0-9]/.test(char)) {
            // condition to check if the char is a number or a operator
              postfix += char;
          } else {
              while (
                  stack.length &&
                  precedence[char] <= precedence[stack[stack.length - 1]]
              ) {
                // postfix  have this 2 conditions:
                // 1) same precendence operator can't be in stack together
                // 2) if a lower precedence operator comes then have to remove higher one 
                  postfix += stack.pop();
              }
              stack.push(char);
          }
      }

      while (stack.length) {
        // add the remaning expression into postfix
          postfix += stack.pop();
      }

      return postfix;
  }

  // this function will calculate the expression
  calculatePostfix(postfix): number {
    const stack = [];

    for (let i = 0; i < postfix.length; i++) {
        const char = postfix[i];

        if (/[0-9]/.test(char)) {
          // condition to check if the char is a number or a operator
            stack.push(parseInt(char, 10));
        } else {
          // gets the top element and solve the expression
            const b = stack.pop();
            const a = stack.pop();
            switch (char) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    stack.push(a / b);
                    break;
                default:
                    break;
            }
        }
    }

    return stack[0];
}



  calculateExpression(calcBody: CalcDto) {
    const expression = calcBody.expression;
    const expressionPattern = /^[0-9][0-9+\-*/\s]*[0-9]$/;
    const isValidExpression = expressionPattern.test(expression);

    if(!isValidExpression){
      throw new BadRequestException("Invalid expression provided");
    }
    console.log("here");
    
    const postfixExpression = this.infixToPostfix(expression);
    const result = this.calculatePostfix(postfixExpression);
    if(result == null)
      throw new BadRequestException("Invalid expression provided");
    return result;
  }
}
