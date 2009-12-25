/*
	Downloadify: Client Side File Creation
	JavaScript + Flash Library

	Copyright (c) 2009 Douglas C. Neiner

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/
package {
	import flash.system.Security;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.net.FileReference;
	import flash.net.FileFilter;
	import flash.net.URLRequest;
	import flash.display.*;
	import flash.external.ExternalInterface;
	
	[SWF(backgroundColor="#CCCCCC")]
	[SWF(backgroundAlpha=0)]
	public class Downloadify extends Sprite {
		
		private var options:Object;
		private var file:FileReference = new FileReference();
		private var queue_name:String = "";
		
		private var _width:Number = 0;
		private var _height:Number = 0;
		
		private var enabled:Boolean = true;
		private var over:Boolean = false;
		private var down:Boolean = false;
	
		private var buttonImage:String = "images/download.png";
		
		private var button:Loader;
		
		public function Downloadify() {
			Security.allowDomain('*');
			
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_SCALE;
			
			options = this.root.loaderInfo.parameters;
			
			queue_name = options.queue_name.toString();
			
			_width  = options.width;
			_height = options.height;
			
			if(options.downloadImage){
				buttonImage = options.downloadImage;
			}
			
			setupDefaultButton();
			addChild(button);
			
			this.buttonMode = true;
			
			this.addEventListener(MouseEvent.CLICK, onMouseClickEvent);
			this.addEventListener(MouseEvent.ROLL_OVER , onMouseEnter);
			this.addEventListener(MouseEvent.ROLL_OUT , onMouseLeave);
			this.addEventListener(MouseEvent.MOUSE_DOWN , onMouseDown);
			this.addEventListener(MouseEvent.MOUSE_UP , onMouseUp);
			
			ExternalInterface.addCallback('setEnabled', setEnabled);
			
			file.addEventListener(Event.COMPLETE, onSaveComplete);
			file.addEventListener(Event.CANCEL, onSaveCancel);
		}
		
		private function setEnabled(isEnabled:Boolean):Boolean {
			enabled = isEnabled;
			if(enabled === true){
				button.y = 0;
				this.buttonMode = true;
			} else {
				button.y = (-3 * _height);
				this.buttonMode = false;
			}
			return enabled;
		}
		
		private function setupDefaultButton():void {
			button = new Loader();
			var urlReq:URLRequest = new URLRequest(buttonImage);
			button.load(urlReq);
			button.x = 0;
			button.y = 0;
		}
		
		
		
		protected function onMouseEnter(event:Event):void {
			if(enabled === true){
				if(down === false) button.y = (-1 * _height);
				over = true;
			}
		}
		protected function onMouseLeave(event:Event):void {
			if(enabled === true){
				if(down === false) button.y = 0;
				over = false;
			}
		}
		protected function onMouseDown(event:Event):void {
			if(enabled === true){
				button.y = button.y = (-2 * _height);
				down = true;
			}
		}
		protected function onMouseUp(event:Event):void {
			if(enabled === true){
				if(over === false){
					button.y = 0;
				} else {
					button.y = (-1 * _height);
				}
				down = false;
			}
		}
		
		protected function onMouseClickEvent(event:Event):void{
			var data:String = ExternalInterface.call('Downloadify.getTextForSave',queue_name);
			var filename:String = ExternalInterface.call('Downloadify.getFileNameForSave',queue_name);
			if (data !== "") {
				file.save(data, filename);
			} else {
				onSaveError();
			}
		}
		
		protected function onSaveComplete(event:Event):void{
			ExternalInterface.call('Downloadify.saveComplete',queue_name);
		}
		
		protected function onSaveCancel(event:Event):void{
			ExternalInterface.call('Downloadify.saveCancel',queue_name);	
		}
		
		protected function onSaveError():void{
			ExternalInterface.call('Downloadify.saveError',queue_name);	
		}
		
	}
}