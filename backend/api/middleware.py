import logging
import time

logger = logging.getLogger('request_logger')

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log request details
        start_time = time.time()
        logger.info(
            f"Request: {request.method} {request.path} "
            f"from {request.META.get('REMOTE_ADDR')}"
        )

        # Process the request and get the response
        response = self.get_response(request)

        # Log response details
        duration = time.time() - start_time
        logger.info(
            f"Response: {response.status_code} "
            f"in {duration:.2f}s"
        )

        return response