/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import MaskedInput from 'react-text-mask';
import moment from 'moment';
import { createAutoCorrectedDatePipe } from 'text-mask-addons';
import VisibilitySensor from 'react-visibility-sensor';

const DateOutput = ( props ) => {
	const {
		required,
		isAnimating,
		attributes,
		setIsValid,
		setIsAnswered,
		isReviewing,
		isActive,
		isFocused,
		val,
		setVal,
		setErrMsgKey,
		setShowErr,
	} = props;
	const { format, separator } = attributes;
	const [ simulateFocusStyle, setSimulateFocusStyle ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );

	const elemRef = useRef();

	const checkfieldValidation = ( value ) => {
		const date = moment( value );
		if ( required === true && ( ! value || value === '' ) ) {
			setIsValid( false );
			setErrMsgKey( 'label.errorAlert.required' );
		} else if ( ! date.isValid() ) {
			setIsValid( false );
			setErrMsgKey( 'label.errorAlert.date' );
		} else {
			setIsValid( true );
			setErrMsgKey( null );
		}
	};

	useEffect( () => {
		checkfieldValidation( val );
	}, [ isReviewing, required ] );

	useEffect( () => {
		if ( isActive ) {
			if ( isFocused && isAnimating ) {
				setSimulateFocusStyle( true );
				return;
			}
			if ( ! isAnimating && isFocused && isVisible ) {
				elemRef.current.inputElement.focus();
				setSimulateFocusStyle( false );
			}
		} else {
			elemRef.current.inputElement.blur();
			setSimulateFocusStyle( true );
		}
	}, [ isAnimating, isActive, isFocused, isVisible ] );

	const changeHandler = ( e ) => {
		const value = e.target.value;
		setShowErr( false );
		checkfieldValidation( value );
		setVal( value );
		if ( value !== '' ) {
			setIsAnswered( true );
		} else {
			setIsAnswered( false );
		}
	};

	const getPlaceholder = () => {
		if ( format === 'MMDDYYYY' ) {
			return 'MM' + separator + 'DD' + separator + 'YYYY';
		} else if ( format === 'DDMMYYYY' ) {
			return 'DD' + separator + 'MM' + separator + 'YYYY';
		} else if ( format === 'YYYYMMDD' ) {
			return 'YYYY' + separator + 'MM' + separator + 'DD';
		}
	};

	const autoCorrectedDatePipe = createAutoCorrectedDatePipe(
		getPlaceholder().toLowerCase()
	);

	const getMask = () => {
		if ( format === 'YYYYMMDD' ) {
			return [
				/\d/,
				/\d/,
				/\d/,
				/\d/,
				separator,
				/\d/,
				/\d/,
				separator,
				/\d/,
				/\d/,
			];
		}
		return [
			/\d/,
			/\d/,
			separator,
			/\d/,
			/\d/,
			separator,
			/\d/,
			/\d/,
			/\d/,
			/\d/,
		];
	};

	return (
		<div className="question__wrapper">
			<VisibilitySensor
				resizeCheck={ true }
				resizeThrottle={ 100 }
				scrollThrottle={ 100 }
				onChange={ ( visible ) => {
					setIsVisible( visible );
				} }
			>
				<MaskedInput
					onChange={ changeHandler }
					ref={ elemRef }
					className={
						'question__InputField' +
						( simulateFocusStyle ? ' no-border' : '' )
					}
					placeholder={ getPlaceholder() }
					mask={ getMask() }
					pipe={ autoCorrectedDatePipe }
					value={ val && val.length > 0 ? val : '' }
				/>
			</VisibilitySensor>
		</div>
	);
};
export default DateOutput;
