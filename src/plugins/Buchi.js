import $ from "jquery"

const Buchi = () => {
   return true;
}

const buchi_validate = (input, constraints) => {

    // Remove existing validation message
    $('.'+input.getAttribute('id')+'-validation-message').remove();

    // REGEX for email fields
    const email_pattern = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    
    // Rules Definition
    const rules = {
        required:{
            pass:constraints.required === true ? input.value.length > 0 : true,
            message:input.getAttribute('id').replace('_', ' ') +" is required"
        },
        min_length:{
            pass:input.value.length > 0 ? input.value.length >= constraints.min_length : true,
            message:input.getAttribute('id').replace('_', ' ') +" must have up to "+constraints.min_length+" characters"
        },
        max_length:{
            pass:input.value.length > 0 ? input.value.length <= constraints.max_length : true,
            message:input.getAttribute('id').replace('_', ' ') +" must not exceed "+constraints.max_length+" characters"
        },
        email:{
            pass: constraints.email === true && input.value.length > 0 ? email_pattern.test(input.value): true,
            message:input.getAttribute('id').replace('_', ' ') +" must be a valid email",
        }
    }

    const feedback = [];
  
    for(let constrain in constraints){
        
        if(rules.hasOwnProperty(constrain)){
            // console.log(constrain)
            if(rules[constrain].pass === false){
                feedback.push({
                    message:rules[constrain],
                    targetId:input.getAttribute('id')
                })
            }

        }else{
            alert('invalid rule '+constrain);
            return {
                status: 'fail',
                error: 'invalid rule '+constrain
            }
        }
       
    }

    feedback.forEach(function(response, index){
        $('#'+response.targetId).css('border-color', 'red');
        if($('#'+response.targetId).parent().hasClass('input-group')){
            $('#'+response.targetId).parent().after(`<p class="text-danger ${response.targetId}-validation-message">${response.message.message}</p>`);
        }else{
            $('#'+response.targetId).parent().append(`<p class="text-danger ${response.targetId}-validation-message">${response.message.message}</p>`);
        }
        
    })

    if(feedback.length === 0){
        return 'success';
    }else{
        return 'fail';
    }
    
}


export function runValidation (fields){
    const negatives = []
    fields.forEach(function(field, index){
        let result = buchi_validate(document.querySelector("#"+field.id), field.rules);
        if( typeof(result) == 'object' ){
            showAlert('danger', result.error)
            negatives.push(false);
            return;
        }
        else if( typeof(result) == 'string' && result === 'success'){
            negatives.push(true);
        }else{
            negatives.push(false);
        }
    });
    // console.log(negatives)
    if(negatives.includes(false)){
        return false
    }else{
        return true;
    }
}


export function setBtnLoading (btn){
    btn.setAttribute('disabled', 'true');
    btn.innerHTML = `<i class="fa fa-spinner fa-spin"></i>`;
    console.log('set');
}

export function setBtnNotLoading (btn, html){
    btn.innerHTML = html
    btn.removeAttribute('disabled');
}

export function showAlert (color, message){
    const alert = `<div class="alert alert-${color} alert-dismissible fade show" role="alert" id="alert-div">
        <strong>Alert!</strong> <span id="alert-message">${message}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`

    const clearAlert = () => {
        document.querySelector('.alert-holder').innerHTML = '';
    }

    document.querySelector('.alert-holder').innerHTML = alert;
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
    setTimeout(clearAlert, 10000);
}

export function togglePasswordReveal (revealIconId, passwordFieldId){

    const passwordInput = $("#"+passwordFieldId);
  
    if(passwordInput.attr("type") === 'text'){
        passwordInput.attr("type", "password");
        $("#"+revealIconId).html("<i class='fa fa-eye'></i>");
    }else{
        passwordInput.attr("type", "text");
        $("#"+revealIconId).html("<i class='fa fa-eye-slash'></i>");
    }
}
export default Buchi;
