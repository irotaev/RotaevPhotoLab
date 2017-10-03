using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;
using RotaevPhotoLabServer.Models;

namespace RotaevPhotoLabServer.Controllers
{
    public class ContactController : Controller
    {
        /// <summary>
        /// Послать данные мне на почту
        /// </summary>
        /// <returns></returns>
        public ActionResult Send(string name, string contact, string email, string phone, string message)
        {
            string errorMessage = null;
            if (string.IsNullOrWhiteSpace(name)) errorMessage += "Заполните, пожалуйста, ваше Имя";

            if (string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(phone) && string.IsNullOrWhiteSpace(contact))
                errorMessage += "Заполните, пожалуйста, Ваши контактные данные: телефон или email";

            if (errorMessage != null)
            {
                Response.StatusCode = (int) HttpStatusCode.BadRequest;

                var error = new ErrorResult
                {
                    Message = errorMessage
                };

                return Json(error);
            }

            #region Send Mail


            using (SmtpClient client = new SmtpClient())
            {
                client.EnableSsl = true;
                client.Port = 587;
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.UseDefaultCredentials = false;
                client.Host = "smtp.gmail.com";
                client.Credentials = new NetworkCredential("Andrey.rtv@gmail.com", "917848c8c3d4d083d9898a1d335179dc");

                MailMessage mail = new MailMessage("autosendler@rotaevphotolab.ru", "irotaev@gmail.com");
                mail.Subject = "Отправили запрос на фотосессию";
                mail.Body =
                $@"
                    Имя: {name}
                    Контакт: eamil: {email} , телефон: {phone
                            } , контакт: {contact}
                    Сообщение: {message}
                ";
                client.Send(mail);
            }

            #endregion

            Response.StatusCode = (int) HttpStatusCode.OK;

            return null;
        }
    }
}