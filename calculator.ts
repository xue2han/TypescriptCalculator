type Num = {
  prev?: Num,
  isZero: 'true' | 'false'
}
type PositiveNum = {
  prev: Num,
  isZero: 'false'
}

type StringBool = 'true' | 'false'

type IsZero<T extends Num> = T['isZero']
type Next<T extends Num> = {
  prev: T,
  isZero: 'false'
}
type Prev<T extends PositiveNum> = T['prev']

type n0 = {'isZero': 'true'}

type Add<T1 extends Num, T2 extends Num> = {
  'true': T2,
  'false': Add<Prev<T1>,Next<T2>>
}[IsZero<T1>]

type Sub<T1 extends Num, T2 extends Num> = {
  'true': T1,
  'zero': n0,
  'false': Sub<Prev<T1>, Prev<T2>>,
}[IsZero<T1> extends 'true' ? 'zero' : IsZero<T2> extends 'true' ? 'true' : 'false']

type IsEqual<T1 extends Num, T2 extends Num> = {
  'true': 'true',
  'false': 'false',
  'running': IsEqual<Prev<T1>, Prev<T2>>
}[IsZero<T1> extends 'true' ? IsZero<T2> extends 'true' ? 'true' : 'false' : 'running']

type Not<T extends StringBool> = T extends 'true' ? 'false' : 'true'

type IsGreaterThen<T1 extends Num, T2 extends Num> = Not<IsZero<Sub<T1, T2>>>

type Mul<T1 extends Num, T2 extends Num, Acc extends Num = n0> = {
  'true': Acc,
  'false': Mul<Prev<T1>, T2, Add<T2, Acc>>,
}[IsZero<T1>]

type Div<T1 extends Num, T2 extends Num, Acc extends Num = n0> = {
  'error': never,
  'true': Acc,
  'false': Div<Sub<T1, T2>, T2, Next<Acc>>
}[IsZero<T2> extends 'true' ? 'error' : IsGreaterThen<T2, T1> extends 'true' ? 'true' : 'false']

type StackLike = {
  prev: StackLike,
  item?: any,
}

type EmptyStack = {
  prev: EmptyStack
}

type PushStack<T,Stack extends StackLike> = {
  prev: Stack,
  item: T,
}

type PopStack<Stack extends StackLike> = Stack extends {prev: infer T} ? T : EmptyStack

type PeekStack<Stack extends StackLike> = Stack extends {item: infer T} ? T : never

type Bottom<Stack extends StackLike> = {
  'true': PeekStack<Stack>,
  'false': Bottom<PopStack<Stack>>,
}[PeekStack<PopStack<Stack>> extends never ? 'true' : 'false'];


type Head<T extends any[]> = 
    HasTail<T> extends 'true' ? T[0] : never


type Tail<Tuple extends any[]> = ((...t: Tuple) => void) extends ((
  h: any,
  ...rest: infer R
) => void)
  ? R : []


type HasTail<T extends any[]> = T extends {'length': infer N} ? N extends 0 ? 'false' : 'true' : 'false'

type Last<T extends any[]> = {
  'false': Head<T>,
  'true': Last<Tail<T>>
}[HasTail<Tail<T>>]

type Reverse<T extends any[], R extends any[] = []> = {
  'false': R,
  'true': Reverse<Tail<T>, Unshift<Head<T>, R>>
}[HasTail<T>]

type Unshift<T extends any, Tuple extends any[]> = ((
  _: T,
  ...rest: Tuple
) => void) extends ((...t: infer R) => void) ? R : [T]

type abgd = [...n1[]]
type nd3 = Unshift<any, abgd>

type LiteralToNum<T extends number, Int extends Num = n0, Arr extends any[] = []> = {
  'true': Int,
  'false': LiteralToNum<T, Next<Int>, Unshift<any, Arr>>
}[Arr['length'] extends T ? 'true' : 'false']

type NumToLiteral<Int extends Num, Acc extends Num = n0, Arr extends any[] = []> = {
  'true': Arr['length'],
  'false': NumToLiteral<Int, Next<Acc>, Unshift<any, Arr>>
}[IsEqual<Int, Acc>]

type Op = '#' | '(' | ')' | '+' | '-' | '*' | '/'

type CalcOp = '+' | '-' | '*' | '/'

type OpGreaterThen<Op1 extends Op, Op2 extends Op> = 
  Op1 extends '#' ? 'false' :
  Op1 extends '(' ? Op2 extends '#' ? 'true' : 'false' : 
  Op1 extends '+' ? 
      Op2 extends '#' ? 'true' : 
      Op2 extends '(' ? 'true' :
      Op2 extends ')' ? 'true' : 
      'false':
  Op1 extends '-' ?
      Op2 extends '#' ? 'true' : 
      Op2 extends '(' ? 'true' :
      Op2 extends ')' ? 'true' : 
      'false':
  Op1 extends '*' ? Op2 extends '/' ? 'false' : 'true':
  Op1 extends '/' ? Op2 extends '*' ? 'false' : 'true':
  never



type CalcNum<T1 extends Num, T2 extends Num, Operator extends CalcOp> =
  Operator extends '+' ? Add<T1, T2> :
  Operator extends '-' ? Sub<T1, T2> :
  Operator extends '*' ? Mul<T1, T2> :
  Operator extends '/' ? Div<T1, T2> : never

type StateConvert = 'init' | 'loop' | 'pop1' | 'pop2' | 'popAll' | 'return'

type Convert2Postfix<Expr extends (Op | number)[], Stack extends Op[] = [], Result extends (Op | number)[] = [], State extends StateConvert = 'init'> = {
  'init': Convert2Postfix<Expr, Unshift<'#', Stack>, Result, 'loop'>,

  'loop': {
    'true': {
      'true': Convert2Postfix<Tail<Expr>, Stack, Unshift<Head<Expr>, Result>, 'loop'>,
      'false': {
        'true': Convert2Postfix<Tail<Expr>, Unshift<Head<Expr>, Stack>, Result, 'loop'>,
        'false': {
          'true': Convert2Postfix<Tail<Expr>, Stack, Result, 'pop1'>,
          'false': {
            'true': Convert2Postfix<Tail<Expr>, Unshift<Head<Expr>, Stack>, Result, 'loop'>,
            'false': Convert2Postfix<Expr, Stack, Result, 'pop2'>
          }[OpGreaterThen<Head<Expr>, Head<Stack>>],
        }[Head<Expr> extends ')' ? 'true' : 'false'],
      }[Head<Expr> extends '(' ? 'true' : 'false'],
    }[Head<Expr> extends number ? 'true' : 'false'],
    'false': Convert2Postfix<Expr, Stack, Result, 'popAll'>,
  }[HasTail<Expr>],

  'pop1': {
    'true': Convert2Postfix<Expr, Tail<Stack>, Result, 'loop'>,
    'false': Convert2Postfix<Expr, Tail<Stack>, Unshift<Head<Stack>, Result>, 'pop1'>
  }[Head<Stack> extends '(' ? 'true' : 'false'],

  'pop2': {
    'true': Convert2Postfix<Expr, Stack, Result, 'loop'>,
    'false': Convert2Postfix<Expr, Tail<Stack>, Unshift<Head<Stack>, Result>, 'pop2'>,
  }[OpGreaterThen<Head<Expr>, Head<Stack>>],

  'popAll': {
    'true': Convert2Postfix<Expr, Stack, Result, 'return'>,
    'false': Convert2Postfix<Expr, Tail<Stack>, Unshift<Head<Stack>, Result>, 'popAll'>,
  }[Head<Stack> extends '#' ? 'true' : 'false'],

  'return': Reverse<Result>,

}[State]

type Tail2<Tuple extends any[]> = ((...t: Tuple) => void) extends ((
  h: any,
  f: any,
  ...rest: infer R
) => void)
  ? R : []

type CalcStack<NumStack extends StackLike, Operator extends CalcOp> = 
  CalcNum<PeekStack<PopStack<NumStack>>, PeekStack<NumStack>, Operator>

type FixArray<Tuple extends any[]> = ((...t:Tuple) => void) extends ((h:infer R) => void) ? [R] : Tuple

type CalcPostfixExpr<Expr extends (number | CalcOp)[], NumStack extends StackLike = EmptyStack> = {
  'true': {
    'true': CalcPostfixExpr<Tail<Expr>, PushStack<LiteralToNum<Head<Expr>>, NumStack>>,
    'false': CalcPostfixExpr<Tail<Expr>, PushStack<CalcStack<NumStack, Head<Expr>>, PopStack<PopStack<NumStack>> > >,
  }[Head<Expr> extends number ? 'true' : 'false'],
  'false': NumToLiteral<PeekStack<NumStack>>,
}[Expr['length'] extends 0 ? 'false' : 'true']

type Calc<Expr extends (Op | number)[]> = 
  CalcPostfixExpr<Convert2Postfix<Expr>>

type a1 = Calc<[1, '+', 10]>
type a2 = Calc<[10, '-', 3]>
type a3 = Calc<[2, '*', 3]>
type a4 = Calc<[8, '/', 4]>
type a5 = Calc<[2, '*', '(', 1, '+', 3, ')']>
type a6 = Calc<['(' , 6, '+', 2, ')', '/', 2]>
type a7 = Calc<[2, '*', '(', 1, '+', 3, ')']>

