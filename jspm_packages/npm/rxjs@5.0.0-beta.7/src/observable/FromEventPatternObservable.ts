import {Observable} from '../Observable';
import {Subscription} from '../Subscription';
import {tryCatch} from '../util/tryCatch';
import {errorObject} from '../util/errorObject';
import {Subscriber} from '../Subscriber';

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
export class FromEventPatternObservable<T, R> extends Observable<T> {

  /**
   * Creates an Observable from an API based on addHandler/removeHandler
   * functions.
   *
   * <span class="informal">Converts any addHandler/removeHandler API to an
   * Observable.</span>
   *
   * <img src="./img/fromEventPattern.png" width="100%">
   *
   * Creates an Observable by using the `addHandler` and `removeHandler`
   * functions to add and remove the handlers, with an optional selector
   * function to project the event arguments to a result. The `addHandler` is
   * called when the output Observable is subscribed, and `removeHandler` is
   * called when the Subscription is unsubscribed.
   *
   * @example <caption>Emits clicks happening on the DOM document</caption>
   * function addClickHandler(handler) {
   *   document.addEventListener('click', handler);
   * }
   *  
   * function removeClickHandler(handler) {
   *   document.removeEventListener('click', handler);
   * }
   *  
   * var clicks = Rx.Observable.fromEventPattern(
   *   addClickHandler,
   *   removeClickHandler
   * );
   * clicks.subscribe(x => console.log(x));
   *
   * @see {@link from}
   * @see {@link fromEvent}
   *
   * @param {function(handler: Function): any} addHandler A function that takes
   * a `handler` function as argument and attaches it somehow to the actual
   * source of events.
   * @param {function(handler: Function): void} removeHandler A function that
   * takes a `handler` function as argument and removes it in case it was
   * previously attached using `addHandler`.
   * @param {function(...args: any): T} [selector] An optional function to
   * post-process results. It takes the arguments from the event handler and
   * should return a single value.
   * @return {Observable<T>}
   * @static true
   * @name fromEventPattern
   * @owner Observable
   */
  static create<T>(addHandler: (handler: Function) => any,
                   removeHandler: (handler: Function) => void,
                   selector?: (...args: Array<any>) => T) {
    return new FromEventPatternObservable(addHandler, removeHandler, selector);
  }

  constructor(private addHandler: (handler: Function) => any,
              private removeHandler: (handler: Function) => void,
              private selector?: (...args: Array<any>) => T) {
    super();
  }

  protected _subscribe(subscriber: Subscriber<T>) {
    const addHandler = this.addHandler;
    const removeHandler = this.removeHandler;
    const selector = this.selector;

    const handler = selector ? function(e: any) {
      let result = tryCatch(selector).apply(null, arguments);
      if (result === errorObject) {
        subscriber.error(result.e);
      } else {
        subscriber.next(result);
      }
    } : function(e: any) { subscriber.next(e); };

    let result = tryCatch(addHandler)(handler);
    if (result === errorObject) {
      subscriber.error(result.e);
    }
    subscriber.add(new Subscription(() => {
      //TODO: determine whether or not to forward to error handler
      removeHandler(handler);
    }));
  }
}
